# 応募マッチ → 採用担当メール（Google Apps Script）

「応募マッチ」の合格者が送信した応募内容を、**採用担当のメールアドレスに直接届ける**ための受信スクリプトです。
（`lib/recruit/clinics/<slug>.js` の `applyMatch.endpoint` に、デプロイして得たウェブアプリURLを設定します。未設定の場合は各職種の応募フォームを開くフォールバックになります。）

## セットアップ手順

1. [script.google.com](https://script.google.com/) で新規プロジェクトを作成
2. 下のコードを貼り付け、`RECRUIT_EMAIL` を**採用担当のメールアドレス**に変更
3. 「デプロイ」→「新しいデプロイ」→ 種類「ウェブアプリ」
   - 実行ユーザー：**自分**
   - アクセスできるユーザー：**全員**
   - 「デプロイ」→ 表示される**ウェブアプリURL**をコピー
4. そのURLを `applyMatch.endpoint` に設定 → ビルド・公開（開発側で対応）

## コード

```javascript
// 応募マッチ 受信 → 採用担当へメール転送
const RECRUIT_EMAIL = 'anna.n@exmore.jp'; // ← 採用担当のメールアドレス（正式決定後に差し替え）

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const a = data.applicant || {};
    const lines = [];
    lines.push('■ 職種：' + (data.job && data.job.label));
    lines.push('■ 判定：' + data.result + (data.fulfillment ? '（充足度：' + data.fulfillment + '）' : ''));
    lines.push('');
    lines.push('【応募者】');
    lines.push('お名前：' + (a.name || ''));
    lines.push('メール：' + (a.email || ''));
    lines.push('電話：' + (a.tel || ''));
    if (a.note) lines.push('ひとこと：' + a.note);
    lines.push('');
    lines.push('【回答内容】');
    (data.answers || []).forEach(function (q) { lines.push('・' + q.q + ' → ' + q.a); });
    lines.push('');
    lines.push('送信元：' + (data.submittedFrom || ''));

    MailApp.sendEmail({
      to: RECRUIT_EMAIL,
      subject: '【採用応募】' + (data.clinicName || '') + '／' + (data.job && data.job.label) + '：' + (a.name || ''),
      body: lines.join('\n'),
      replyTo: a.email || undefined,
    });
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

## メモ
- LP側は CORS プリフローを避けるため `text/plain` + `no-cors` で POST します（レスポンスは読まない）。
- 充足度（看護師の 高/中/低）はメール本文に同梱され、「経歴書要否・即面接」の判断材料になります。
- 個人情報は合格者のみが入力し、送信先は上記メールのみ（LP側に保存はしません）。
