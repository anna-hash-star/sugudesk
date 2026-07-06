import Link from 'next/link';
import RecruitLayout, { Photo } from '../../components/recruit/RecruitLayout';
import { useRecruitChat } from '../../components/recruit/ChatWidget';
import { clinic, stats, director, jobs, voices, support, flowSteps, faqs, chatScript } from '../../lib/recruit/site-data';

function Eyebrow({ en, ja }) {
  return (
    <div className="mb-4">
      <div className="text-[11px] tracking-[0.25em] text-rc-teal font-bold">{en}</div>
      <h2 className="rc-mincho text-2xl md:text-[32px] font-semibold text-rc-ink mt-1.5 leading-snug">{ja}</h2>
    </div>
  );
}

/* 1. ファーストビュー：勤務地・休日を即答し、CV3段（応募/見学/相談）を提示 */
function Hero() {
  const { openChat } = useRecruitChat();
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-12 md:pt-20 pb-14 md:pb-24 grid md:grid-cols-[1.1fr_1fr] gap-10 items-center">
        <div>
          <p className="text-[12px] tracking-[0.3em] text-rc-teal font-bold">{clinic.enName}</p>
          <h1 className="rc-mincho text-[34px] md:text-5xl font-semibold leading-[1.35] mt-4 text-rc-ink" style={{ textWrap: 'balance' }}>
            {clinic.tagline}
          </h1>
          <p className="mt-5 text-[15px] leading-8 text-rc-ink-soft max-w-lg">{clinic.lead}</p>

          <div className="flex flex-wrap gap-2 mt-6" aria-label="働きやすさの要点">
            {clinic.badges.map(b => (
              <span key={b} className="text-[12px] font-medium bg-white border border-rc-sand rounded-full px-3.5 py-1.5 text-rc-ink">
                {b}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mt-4" aria-label="募集中の職種">
            {jobs.map(j => (
              <Link key={j.slug} href={`/recruit/jobs/${j.slug}`}
                className="text-[12px] font-bold text-rc-teal bg-rc-teal-soft rounded-full px-3.5 py-1.5 hover:bg-rc-teal hover:text-white transition-colors">
                {j.title} 募集中
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-8">
            <Link href="/recruit/entry"
              className="bg-rc-teal text-white font-bold text-[15px] rounded-full px-8 py-3.5 hover:bg-rc-teal-dark transition-colors shadow-md shadow-rc-teal/25">
              応募する
            </Link>
            <Link href="/recruit/flow"
              className="border-2 border-rc-teal text-rc-teal font-bold text-[15px] rounded-full px-7 py-3 hover:bg-rc-teal-soft transition-colors">
              まず見学する
            </Link>
            <button onClick={() => openChat()}
              className="text-[14px] font-bold text-rc-teal underline underline-offset-4 decoration-rc-teal/40 hover:decoration-rc-teal transition-colors">
              💬 匿名で相談する
            </button>
          </div>
        </div>
        <Photo label="スタッフの働く姿（実写に差し替え）" ratio="aspect-[4/5] md:aspect-[4/4.6]" className="max-w-md ml-auto w-full" />
      </div>
    </section>
  );
}

/* 2. 数字で見る */
function Stats() {
  return (
    <section id="stats" className="bg-white border-y border-rc-sand scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-14 md:py-20">
        <Eyebrow en="BY THE NUMBERS" ja={`数字で見る、${clinic.shortName}`} />
        <p className="text-sm text-rc-ink-soft mb-8 max-w-xl">言葉より、実績で。働きやすさに関わる数字をそのまま公開しています。</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          {stats.map(s => (
            <div key={s.label} className="rounded-xl bg-rc-ivory border border-rc-sand px-4 py-5 text-center">
              <div className="rc-mincho text-rc-teal-dark">
                <span className="text-4xl font-semibold tracking-tight" style={{ fontVariantNumeric: 'tabular-nums' }}>{s.value}</span>
                <span className="text-base ml-0.5">{s.unit}</span>
              </div>
              <div className="text-[13px] font-bold mt-2">{s.label}</div>
              <div className="text-[11px] text-rc-ink-soft mt-1">{s.note}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 3. 院長メッセージ：理念は「働く人に向けた言葉」で */
function Director() {
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 py-14 md:py-20 grid md:grid-cols-[1fr_1.4fr] gap-8 md:gap-12 items-start">
      <div>
        <Photo label="院長の写真" ratio="aspect-[3/3.4]" />
        <div className="mt-3 text-sm">
          <span className="font-bold">{director.name}</span>
          <span className="text-rc-ink-soft ml-2">{director.title}</span>
        </div>
      </div>
      <div>
        <Eyebrow en="MESSAGE" ja={director.headline} />
        <div className="space-y-5 text-[15px] leading-8 text-rc-ink max-w-xl">
          {director.message.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>
    </section>
  );
}

/* 4. 職種から探す（v2の中心：職種別ページへのハブ） */
function JobsIndex() {
  return (
    <section id="jobs" className="bg-rc-teal-dark scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-14 md:py-20">
        <div className="mb-8">
          <div className="text-[11px] tracking-[0.25em] text-rc-teal-soft font-bold">OPEN POSITIONS</div>
          <h2 className="rc-mincho text-2xl md:text-[32px] font-semibold text-white mt-1.5">職種から探す</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {jobs.map(j => (
            <Link key={j.slug} href={`/recruit/jobs/${j.slug}`}
              className="group rounded-2xl bg-white p-6 hover:-translate-y-1 transition-transform shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-rc-ink">{j.title}</h3>
                <div className="flex gap-1">
                  {j.employmentTypes.map(e => (
                    <span key={e.type} className="text-[10px] font-bold text-rc-teal bg-rc-teal-soft rounded px-1.5 py-0.5">{e.type}</span>
                  ))}
                </div>
              </div>
              <p className="rc-mincho text-[15px] text-rc-teal-dark mt-3 leading-relaxed">{j.catch}</p>
              <p className="text-[13px] text-rc-ink-soft mt-3 leading-relaxed line-clamp-3">{j.summary}</p>
              <div className="mt-5 text-[13px] font-bold text-rc-teal flex items-center gap-1">
                仕事内容と募集要項を見る
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 5. スタッフの声 */
function Voices() {
  return (
    <section id="voice" className="max-w-6xl mx-auto px-4 md:px-6 py-14 md:py-20 scroll-mt-20">
      <Eyebrow en="STAFF VOICE" ja="先に働いている人の、正直な話。" />
      <div className="grid md:grid-cols-3 gap-5 mt-8">
        {voices.map(v => (
          <article key={v.id} className="rounded-2xl bg-white border border-rc-sand overflow-hidden flex flex-col">
            <Photo label={v.photoLabel} ratio="aspect-[16/10]" className="!rounded-none" />
            <div className="p-6 flex-1 flex flex-col">
              <div className="text-[12px] text-rc-ink-soft">{v.role}・{v.years}</div>
              <h3 className="rc-mincho text-[17px] text-rc-teal-dark leading-relaxed mt-2">「{v.reason.slice(0, 42)}…」</h3>
              <dl className="mt-4 space-y-3 text-[13px] leading-relaxed flex-1">
                <div>
                  <dt className="font-bold text-rc-teal">入職の決め手</dt>
                  <dd className="text-rc-ink-soft mt-0.5">{v.reason}</dd>
                </div>
                <div>
                  <dt className="font-bold text-rc-teal">前職との違い</dt>
                  <dd className="text-rc-ink-soft mt-0.5">{v.gap}</dd>
                </div>
              </dl>
              <p className="mt-4 pt-4 border-t border-rc-sand text-[13px] text-rc-ink">
                <span className="font-bold">応募を考えている方へ：</span>{v.message}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* 6. 教育・福利厚生：「制度名＋期間」で具体に */
function Support() {
  return (
    <section className="bg-white border-y border-rc-sand">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-14 md:py-20">
        <Eyebrow en="EDUCATION & BENEFITS" ja="「ついていけるかな」を、制度でなくす。" />
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {support.education.map((e, i) => (
            <div key={e.title} className="rounded-xl border border-rc-sand bg-rc-ivory p-6">
              <div className="text-[11px] tracking-[0.2em] text-rc-teal font-bold">SUPPORT {String(i + 1).padStart(2, '0')}</div>
              <h3 className="font-bold text-[15px] mt-2">{e.title}</h3>
              <p className="text-[13px] text-rc-ink-soft leading-relaxed mt-2">{e.text}</p>
            </div>
          ))}
        </div>
        <ul className="flex flex-wrap gap-2 mt-6" aria-label="福利厚生">
          {support.benefits.map(b => (
            <li key={b} className="text-[12px] font-medium bg-rc-ivory border border-rc-sand rounded-full px-3.5 py-1.5 text-rc-ink-soft">
              {b}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* 7. チャットで採用相談（本テンプレートの差別化セクション） */
function ChatSection() {
  const { openChat } = useRecruitChat();
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 py-14 md:py-20 grid md:grid-cols-2 gap-10 items-center">
      <div>
        <Eyebrow en="CHAT" ja="応募の前に、聞きにくいことを聞いてください。" />
        <p className="text-[15px] leading-8 text-rc-ink-soft">
          電話は緊張するし、メールは重い。だから当院は<b className="text-rc-ink">匿名で使えるチャット相談</b>を用意しました。
          給与のこと、ブランクのこと、シフトの融通のこと——応募を決める前の質問こそ歓迎です。お名前や連絡先は、見学を予約するときまで不要です。
        </p>
        <ul className="mt-5 space-y-2 text-[14px]">
          {['匿名のままでOK・連絡先は不要', '24時間いつでも受付（夜勤明けでも）', '回答は募集要項と同じ内容を保証'].map(t => (
            <li key={t} className="flex items-start gap-2.5">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-rc-teal shrink-0" aria-hidden="true" />
              {t}
            </li>
          ))}
        </ul>
        <button onClick={() => openChat()}
          className="mt-7 bg-rc-teal text-white font-bold text-[15px] rounded-full px-8 py-3.5 hover:bg-rc-teal-dark transition-colors shadow-md shadow-rc-teal/25">
          💬 チャットで相談してみる
        </button>
      </div>

      {/* 会話プレビュー（クリックで実チャットが開く） */}
      <button onClick={() => openChat()} className="text-left rounded-2xl bg-white border border-rc-sand p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer w-full"
        aria-label="チャットのプレビュー。クリックで相談を開始">
        <div className="text-[11px] font-bold text-rc-teal border-b border-rc-sand pb-3 mb-4">💬 採用相談チャット — 匿名OK</div>
        <div className="space-y-3">
          <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-rc-ivory border border-rc-sand px-4 py-2.5 text-[13px] leading-relaxed">
            {chatScript.greeting}
          </div>
          <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-rc-teal text-white px-4 py-2.5 text-[13px]">
            {chatScript.sampleQuestion}
          </div>
          <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-rc-ivory border border-rc-sand px-4 py-2.5 text-[13px] leading-relaxed">
            {faqs[0].a}
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {chatScript.chips.slice(0, 3).map(c => (
              <span key={c.key} className="text-[11px] font-medium border border-rc-teal text-rc-teal rounded-full px-3 py-1">{c.label}</span>
            ))}
          </div>
        </div>
      </button>
    </section>
  );
}

/* 8. 見学・応募の流れ（抜粋） */
function FlowDigest() {
  return (
    <section className="bg-white border-y border-rc-sand">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-14 md:py-20">
        <Eyebrow en="PROCESS" ja="入職まで、最短2週間。" />
        <ol className="grid md:grid-cols-4 gap-4 mt-8">
          {flowSteps.map(s => (
            <li key={s.step} className={`rounded-xl p-5 border ${s.chat ? 'bg-rc-teal-soft border-rc-teal/40' : 'bg-rc-ivory border-rc-sand'}`}>
              <div className={`text-[11px] tracking-[0.2em] font-bold ${s.chat ? 'text-rc-teal' : 'text-rc-ink-soft'}`}>{s.step}</div>
              <h3 className="font-bold text-[15px] mt-1.5">{s.title}</h3>
              <p className="text-[12.5px] text-rc-ink-soft leading-relaxed mt-2">{s.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8">
          <Link href="/recruit/flow" className="text-[14px] font-bold text-rc-teal hover:underline underline-offset-4">
            見学当日の流れをくわしく見る →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* 9. FAQ：チャットとナレッジ共通。解決しなければチャットへ */
function Faq() {
  const { openChat } = useRecruitChat();
  return (
    <section id="faq" className="max-w-3xl mx-auto px-4 md:px-6 py-14 md:py-20 scroll-mt-20">
      <Eyebrow en="FAQ" ja="よくある質問" />
      <div className="mt-6 divide-y divide-rc-sand border-y border-rc-sand">
        {faqs.map(f => (
          <details key={f.q} className="group py-1">
            <summary className="flex items-center gap-3 cursor-pointer list-none py-4 text-[15px] font-bold hover:text-rc-teal transition-colors">
              <span className="rc-mincho text-rc-teal text-lg shrink-0" aria-hidden="true">Q</span>
              <span className="flex-1">{f.q}</span>
              <span className="text-rc-ink-soft transition-transform group-open:rotate-45 text-xl leading-none" aria-hidden="true">＋</span>
            </summary>
            <p className="pl-8 pb-5 text-[14px] leading-7 text-rc-ink-soft">{f.a}</p>
          </details>
        ))}
      </div>
      <p className="mt-6 text-[14px] text-rc-ink-soft">
        解決しませんでしたか？
        <button onClick={() => openChat()} className="ml-2 font-bold text-rc-teal underline underline-offset-4 decoration-rc-teal/40 hover:decoration-rc-teal">
          チャットで質問する（匿名OK）
        </button>
      </p>
    </section>
  );
}

/* 10. クロージングCTA */
function Closing() {
  const { openChat } = useRecruitChat();
  return (
    <section className="bg-rc-teal">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-20 text-center">
        <h2 className="rc-mincho text-2xl md:text-[32px] font-semibold text-white leading-snug" style={{ textWrap: 'balance' }}>
          まずは30分、見学だけでも。
        </h2>
        <p className="text-white/80 text-[14px] mt-3">私服OK・履歴書不要。職場の空気を見てから決めてください。</p>
        <div className="flex flex-wrap justify-center items-center gap-3 mt-8">
          <Link href="/recruit/entry"
            className="bg-white text-rc-teal font-bold text-[15px] rounded-full px-8 py-3.5 hover:bg-rc-ivory transition-colors">
            応募・見学を予約する
          </Link>
          <button onClick={() => openChat()}
            className="border-2 border-white/70 text-white font-bold text-[15px] rounded-full px-7 py-3 hover:bg-white/10 transition-colors">
            💬 その前に相談する
          </button>
        </div>
      </div>
    </section>
  );
}

export default function RecruitTop() {
  return (
    <RecruitLayout>
      <Hero />
      <Stats />
      <Director />
      <JobsIndex />
      <Voices />
      <Support />
      <ChatSection />
      <FlowDigest />
      <Faq />
      <Closing />
    </RecruitLayout>
  );
}
