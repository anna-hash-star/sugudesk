// Cloudflare Pages Function — POST /contact
// フォーム送信を受け取り、Resend 経由でメール送信する（スパムフィルタを介さず直接届く）。
// 必要な環境変数（Cloudflare Pages → Settings → Environment variables）:
//   RESEND_API_KEY … Resend の APIキー（re_xxx）  ※必須
//   CONTACT_TO      … 受信したいメールアドレス（未設定なら下のデフォルト）
//   CONTACT_FROM    … 送信元（未設定なら Resend の onboarding アドレス）

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function esc(s) {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export async function onRequestPost({ request, env }) {
  try {
    const form = await request.formData();
    const get = (k) => (form.get(k) || '').toString().trim();

    // ハニーポット（bot対策）: 隠しフィールドが埋まっていたら成功偽装して破棄
    if (get('_gotcha')) return json({ ok: true });

    const company = get('company');
    const name = get('name');
    const email = get('email');
    const phone = get('phone');
    const message = get('message');

    if (!name || !email || !message) {
      return json({ ok: false, error: 'missing_fields' }, 400);
    }

    if (!env.RESEND_API_KEY) {
      return json({ ok: false, error: 'not_configured' }, 500);
    }

    const to = env.CONTACT_TO || 'anna.negoro@exmore.jp';
    const from = env.CONTACT_FROM || 'exmore お問い合わせ <onboarding@resend.dev>';

    const text =
      `exmore 公式サイトからお問い合わせがありました。\n\n` +
      `会社名: ${company}\n` +
      `お名前: ${name}\n` +
      `メール: ${email}\n` +
      `電話番号: ${phone}\n` +
      `----\n${message}\n`;

    const html =
      `<div style="font-family:sans-serif;line-height:1.7;color:#0e1b2a">` +
      `<h2 style="margin:0 0 12px">exmore 公式サイト お問い合わせ</h2>` +
      `<table style="border-collapse:collapse">` +
      `<tr><td style="padding:4px 12px 4px 0;color:#5a6b7b">会社名</td><td>${esc(company)}</td></tr>` +
      `<tr><td style="padding:4px 12px 4px 0;color:#5a6b7b">お名前</td><td>${esc(name)}</td></tr>` +
      `<tr><td style="padding:4px 12px 4px 0;color:#5a6b7b">メール</td><td>${esc(email)}</td></tr>` +
      `<tr><td style="padding:4px 12px 4px 0;color:#5a6b7b">電話番号</td><td>${esc(phone)}</td></tr>` +
      `</table>` +
      `<p style="margin:16px 0 6px;color:#5a6b7b">お問い合わせ内容</p>` +
      `<div style="padding:14px 16px;background:#f4f8fc;border-radius:10px;white-space:pre-wrap">${esc(message)}</div>` +
      `</div>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: email,
        subject: `【お問い合わせ】${company || name} 様`,
        text,
        html,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      return json({ ok: false, error: 'send_failed', detail }, 502);
    }
    return json({ ok: true });
  } catch (e) {
    return json({ ok: false, error: 'exception' }, 500);
  }
}
