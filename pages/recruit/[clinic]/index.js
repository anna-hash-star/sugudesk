import { useState } from 'react';
import Link from 'next/link';
import RecruitLayout, { Photo } from '../../../components/recruit/RecruitLayout';
import { useRecruitChat, ChatIcon } from '../../../components/recruit/ChatWidget';
import { Reveal, CountUp } from '../../../components/recruit/Reveal';
import { useClinic } from '../../../lib/recruit/clinic-context';
import { asset } from '../../../lib/recruit/asset';
import { CLINIC_SLUGS, getClinicBundle } from '../../../lib/recruit/clinics';

// 「、」を含む見出しはスマホでは読点の直後で改行する（中途半端な折り返しを防ぐ）
function breakAtComma(text) {
  const parts = String(text).split('、');
  if (parts.length === 1) return text;
  return parts.map((part, i) => (
    <span key={i}>
      {part}
      {i < parts.length - 1 && <>、<br className="md:hidden" /></>}
    </span>
  ));
}

function Eyebrow({ en, ja }) {
  return (
    <div className="mb-4">
      <div className="text-[14px] tracking-[0.16em] text-rc-teal font-bold">{en}</div>
      <h2 className="rc-mincho text-[22px] md:text-[32px] font-semibold text-rc-ink mt-1.5 leading-snug">{breakAtComma(ja)}</h2>
    </div>
  );
}

/* 1. ファーストビュー：勤務地・休日を即答し、CV3段（応募/見学/相談）を提示 */
function Hero() {
  const { clinic, jobs, hasTour, slug } = useClinic();
  const { openChat } = useRecruitChat();
  const base = `/recruit/${slug}`;
  const softPink = clinic.heroDecor === 'soft-pink';
  return (
    <section className={`relative overflow-hidden ${softPink ? 'rc-hero-soft' : ''}`}>
      {softPink ? (
        // ファーストビューの淡いピンク装飾：白に近い地色＋左下の淡い円・曲線・規則ドット。
        // 写真（右）には重ねず、可読性を邪魔しない範囲で配置。スマホではドット/リングを非表示に。
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {/* 左下：ごく淡いピンクの円（にじみ） */}
          <div className="rc-drift absolute -bottom-44 -left-40 w-[38rem] h-[38rem] rounded-full"
               style={{ background: 'radial-gradient(closest-side, rgba(243,200,218,0.30), rgba(243,200,218,0))' }} />
          <div className="rc-drift absolute bottom-2 left-16 w-72 h-72 rounded-full"
               style={{ animationDelay: '-6s', background: 'radial-gradient(closest-side, rgba(247,220,232,0.45), rgba(247,220,232,0))' }} />
          {/* 曲線：淡いローズの細いリング（左下） */}
          <div className="absolute -bottom-28 left-2 w-[26rem] h-[26rem] rounded-full border border-[#F3C8DA] opacity-30 hidden md:block" />
          {/* 規則的な小ドット（左下・少量） */}
          <div className="rc-hero-dots absolute bottom-10 left-6 w-44 h-24 opacity-[0.35] hidden md:block" />
          {/* 濃いローズのアクセントドット（少量） */}
          <div className="absolute bottom-[4.6rem] left-[3.4rem] w-1.5 h-1.5 rounded-full bg-rc-teal opacity-70 hidden md:block" />
          <div className="absolute bottom-[3.1rem] left-[6.1rem] w-1 h-1 rounded-full bg-rc-teal opacity-50 hidden md:block" />
        </div>
      ) : (
        <>
          {/* 背景の装飾（ゆっくり漂う） */}
          <div className="rc-drift absolute -top-24 -right-24 w-96 h-96 rounded-full bg-rc-teal-soft/70 blur-3xl" aria-hidden="true" />
          <div className="rc-drift absolute top-64 -left-32 w-80 h-80 rounded-full bg-rc-sand/80 blur-3xl" style={{ animationDelay: '-7s' }} aria-hidden="true" />
        </>
      )}

      <div className="relative max-w-6xl mx-auto px-4 md:px-6 pt-12 md:pt-20 pb-14 md:pb-24 grid md:grid-cols-[1.1fr_1fr] gap-10 items-center">
        <div>
          <p className="rc-hero-in text-[14px] tracking-[0.2em] text-rc-teal font-bold">{clinic.shortName} 採用サイト</p>
          {(() => {
            const lines = clinic.tagline.split('\n');
            return (
              <h1
                className={`rc-hero-in rc-mincho font-semibold leading-[1.4] mt-4 text-rc-ink ${
                  lines.length > 1 ? 'text-[21px] md:text-[38px]' : 'text-[34px] md:text-5xl'
                }`}
                style={{ textWrap: lines.length > 1 ? undefined : 'balance', '--rc-delay': '120ms' }}
              >
                {lines.map(l => <span key={l} className="block">{l}</span>)}
              </h1>
            );
          })()}
          <p className="rc-hero-in mt-5 text-[17px] leading-8 text-rc-ink-soft max-w-lg" style={{ '--rc-delay': '240ms' }}>{clinic.lead}</p>

          <div className="rc-hero-in flex flex-wrap gap-2 mt-6" style={{ '--rc-delay': '340ms' }} aria-label="働きやすさの要点">
            {clinic.badges.map(b => (
              <span key={b} className="text-[14px] font-medium bg-white border border-rc-sand rounded-full px-3.5 py-1.5 text-rc-ink">
                {b}
              </span>
            ))}
          </div>

          <div className="rc-hero-in flex flex-wrap gap-2 mt-4" style={{ '--rc-delay': '420ms' }} aria-label="募集中の職種">
            {jobs.map(j => (
              <Link key={j.slug} href={`${base}/jobs/${j.slug}`}
                className="text-[14px] font-bold text-rc-teal bg-rc-teal-soft rounded-full px-3.5 py-1.5 hover:bg-rc-teal hover:text-white transition-colors">
                {j.pending ? `${j.title}（求人準備中）` : `${j.title} 募集中`}
              </Link>
            ))}
          </div>

          <div className="rc-hero-in flex flex-wrap items-center gap-3 mt-8" style={{ '--rc-delay': '500ms' }}>
            <Link href={`${base}/entry`}
              className="bg-rc-teal text-white font-bold text-[17px] rounded-full px-8 py-3.5 hover:bg-rc-teal-dark transition-colors shadow-md shadow-rc-teal/25">
              応募する
            </Link>
            {hasTour && (
              <Link href={`${base}/flow`}
                className="border-2 border-rc-teal text-rc-teal font-bold text-[17px] rounded-full px-7 py-3 hover:bg-rc-teal-soft transition-colors">
                まず見学する
              </Link>
            )}
            {!clinic.chatWidget && (
              <button onClick={() => openChat()}
                className="inline-flex items-center gap-1.5 text-[16px] font-bold text-rc-teal underline underline-offset-4 decoration-rc-teal/40 hover:decoration-rc-teal transition-colors">
                <ChatIcon className="w-4 h-4" /> 匿名で相談する
              </button>
            )}
          </div>
        </div>
        <div className="rc-hero-in max-w-md ml-auto w-full" style={{ '--rc-delay': '260ms' }}>
          <Photo
            label="受付・院内の写真"
            scene={clinic.heroScene || 'staff'}
            src={clinic.photos?.hero}
            ratio="aspect-[4/5] md:aspect-[4/4.6]"
            className={softPink
              ? '!rounded-[28px] shadow-[0_22px_48px_-20px_rgba(190,150,170,0.45)]'
              : 'shadow-xl shadow-rc-teal/10'}
          />
        </div>
      </div>
    </section>
  );
}

/* 2. 数字で見る */
function Stats() {
  const { clinic, stats } = useClinic();
  return (
    <section id="stats" className="bg-white border-y border-rc-sand scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-14 md:py-20">
        <Eyebrow en="数字で見る" ja={clinic.statsHeadline || '言葉より、実績で。'} />
        <p className="text-[16px] text-rc-ink-soft mb-8 max-w-xl">働きやすさに関わる数字を、そのまま公開しています。</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 90}>
              <div className="rounded-xl bg-rc-ivory border border-rc-sand px-4 py-5 text-center h-full">
                <div className="rc-mincho text-rc-teal-dark">
                  <span className="text-[44px] font-semibold tracking-tight" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    <CountUp value={s.value} />
                  </span>
                  <span className="text-base ml-0.5">{s.unit}</span>
                </div>
                <div className="text-[15px] font-bold mt-2">{s.label}</div>
                {s.note && <div className="text-[13px] text-rc-ink-soft mt-1">{s.note}</div>}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 3. 院長メッセージ：理念は「働く人に向けた言葉」で */
function Director() {
  const { clinic, director } = useClinic();
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 py-14 md:py-20 grid md:grid-cols-[1fr_1.4fr] gap-8 md:gap-12 items-start">
      <Reveal>
        <Photo label={`${director.title}の写真`} scene="director" src={clinic.photos?.director} ratio="aspect-[3/3.4]" />
        <div className="mt-3 text-[16px]">
          <span className="font-bold">{director.name}</span>
          <span className="text-rc-ink-soft ml-2">{director.title}</span>
        </div>
      </Reveal>
      <Reveal delay={140}>
        <Eyebrow en={`${director.title}メッセージ`} ja={director.headline} />
        <div className="space-y-5 text-[17px] leading-8 text-rc-ink max-w-xl">
          {director.message.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </Reveal>
    </section>
  );
}

/* 3.5 治療ポリシー（データに policies がある場合のみ表示） */
function Policies() {
  const { policies } = useClinic();
  if (!policies) return null;
  return (
    <section className="bg-white border-y border-rc-sand">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-14 md:py-20">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-[14px] tracking-[0.16em] text-rc-teal font-bold">当院のポリシー</div>
            <p className="rc-mincho text-[22px] md:text-[32px] font-semibold text-rc-ink mt-2 leading-snug">
              「{breakAtComma(policies.slogan)}」
            </p>
            <p className="text-[16px] text-rc-ink-soft mt-4 leading-7">{policies.intro}</p>
          </div>
        </Reveal>
        <ol className="grid md:grid-cols-2 gap-4 mt-10 max-w-3xl mx-auto">
          {policies.items.map((p, i) => (
            <Reveal key={p} delay={i * 90} as="li" className="flex gap-4 rounded-xl bg-rc-ivory border border-rc-sand p-5">
              <span className="rc-mincho text-2xl font-semibold text-rc-teal shrink-0 leading-none mt-0.5">{String(i + 1).padStart(2, '0')}</span>
              <p className="text-[16px] leading-7">{p}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* 3.7 当院ならではの強み（データに signature がある場合のみ表示・FLALU COSME等） */
function Signature() {
  const { signature } = useClinic();
  if (!signature) return null;
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 py-14 md:py-20 grid md:grid-cols-[1.1fr_1fr] gap-10 items-center">
      <Reveal>
        <Eyebrow en={signature.eyebrow} ja={signature.title} />
        <div className="space-y-4 text-[17px] leading-8 text-rc-ink max-w-xl">
          {signature.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </Reveal>
      <Reveal delay={150}>
        {signature.image ? (
          <figure className="rounded-xl overflow-hidden bg-white border border-rc-sand shadow-lg shadow-rc-teal/10">
            <img src={asset(signature.image)} alt={signature.imageAlt} className="w-full h-auto" />
          </figure>
        ) : (
          // 画像未提供のあいだは scene のイラストで表示（枠が空にならない）
          <Photo label={signature.imageAlt || 'イメージ'} scene={signature.scene || 'clinic'} src={signature.image} ratio="aspect-[4/3]" className="shadow-lg shadow-rc-teal/10" />
        )}
      </Reveal>
    </section>
  );
}

/* 3.8 相性診断（マッチ度チェック）：4問に答えると おすすめ職種＋マッチ度＋応募導線が出る */
function Diagnosis() {
  const { diagnosis, jobs, slug } = useClinic();
  const base = `/recruit/${slug}`;
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);      // 0..questions.length-1、以降が結果
  const [answers, setAnswers] = useState([]);
  if (!diagnosis) return null;
  const qs = diagnosis.questions;
  const done = started && step >= qs.length;

  const pick = (opt) => {
    const next = answers.slice(0, step);
    next[step] = opt;
    setAnswers(next);
    setStep(step + 1);
  };
  const back = () => setStep(Math.max(0, step - 1));
  const restart = () => { setAnswers([]); setStep(0); setStarted(true); };

  let result = null;
  if (done && answers.length) {
    // 各回答の重みを職種ごとに合算し、最高スコアの職種をおすすめする。
    const scores = { doctor: 0, nurse: 0, clerk: 0, assistant: 0 };
    let tempo, pts = 0;
    answers.forEach(a => {
      if (!a) return;
      if (a.w) for (const k in a.w) scores[k] = (scores[k] || 0) + a.w[k];
      if (a.tempo) tempo = a.tempo;
      pts += a.pts || 0;
    });
    // 同点は doctor > nurse > clerk > assistant の順で優先（Object.keys の並び順）
    const jobKey = Object.keys(scores).reduce((best, k) => (scores[k] > scores[best] ? k : best));
    const pct = Math.min(99, 90 + pts);
    let jobSlug = jobKey;
    if (jobKey === 'doctor') jobSlug = tempo === 'spot' ? 'doctor-parttime' : 'doctor-fulltime';
    const job = jobs.find(j => j.slug === jobSlug) || jobs.find(j => j.slug.indexOf(jobKey) === 0) || null;
    result = { pct, job, info: diagnosis.jobMap[jobKey] || {} };
  }

  return (
    <section id="diagnosis" className="bg-rc-teal-soft/50 border-y border-rc-sand scroll-mt-20">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-14 md:py-20">
        <div className="text-center">
          <div className="text-[14px] tracking-[0.16em] text-rc-teal font-bold">{diagnosis.eyebrow}</div>
          <h2 className="rc-mincho text-[22px] md:text-[32px] font-semibold text-rc-ink mt-1.5">{diagnosis.title}</h2>
          <p className="text-[16px] text-rc-ink-soft mt-3">{diagnosis.lead}</p>
        </div>

        <div className="mt-8 rounded-2xl bg-white border border-rc-sand shadow-sm p-6 md:p-8">
          {!started ? (
            <div className="text-center py-6">
              <button onClick={restart}
                className="bg-rc-teal text-white font-bold text-[17px] rounded-full px-8 py-3.5 hover:bg-rc-teal-dark transition-colors shadow-md shadow-rc-teal/25">
                {diagnosis.startCta}
              </button>
              <p className="text-[13px] text-rc-ink-soft mt-3">※結果は相性の目安です（採用を保証するものではありません）</p>
            </div>
          ) : !done ? (
            <div>
              <div className="flex items-center justify-between text-[13px] text-rc-ink-soft mb-3">
                <span>質問 {step + 1} / {qs.length}</span>
                {step > 0 && <button onClick={back} className="hover:text-rc-teal">← 戻る</button>}
              </div>
              <div className="h-1.5 rounded-full bg-rc-sand overflow-hidden mb-6">
                <div className="h-full bg-rc-teal transition-all duration-300" style={{ width: `${(step / qs.length) * 100}%` }} />
              </div>
              <h3 className="rc-mincho text-[19px] md:text-[22px] font-semibold text-rc-ink text-center">{qs[step].q}</h3>
              <div className="grid gap-3 mt-6">
                {qs[step].options.map((o, i) => (
                  <button key={i} onClick={() => pick(o)}
                    className="text-left text-[16px] font-medium rounded-xl border border-rc-sand bg-rc-ivory px-5 py-4 hover:border-rc-teal hover:bg-rc-teal-soft transition-colors">
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-[14px] text-rc-ink-soft">{diagnosis.resultLead}</div>
              <div className="rc-mincho text-[26px] md:text-[32px] font-semibold text-rc-teal-dark mt-1">{result.info.label}</div>
              <div className="mt-5 max-w-xs mx-auto">
                <div className="flex items-end justify-center gap-1">
                  <span className="rc-mincho text-[48px] leading-none font-semibold text-rc-teal" style={{ fontVariantNumeric: 'tabular-nums' }}>{result.pct}</span>
                  <span className="text-[20px] font-bold text-rc-teal mb-1">%</span>
                </div>
                <div className="text-[13px] font-bold text-rc-teal tracking-wide">マッチ度</div>
                <div className="h-2 rounded-full bg-rc-sand overflow-hidden mt-2">
                  <div className="h-full bg-rc-teal transition-all duration-500" style={{ width: `${result.pct}%` }} />
                </div>
              </div>
              <p className="text-[15px] leading-7 text-rc-ink-soft mt-5 max-w-md mx-auto">{result.info.blurb}</p>
              <p className="text-[15px] leading-7 text-rc-ink mt-3 max-w-md mx-auto font-medium">{diagnosis.encourage}</p>
              <div className="flex flex-wrap justify-center gap-3 mt-7">
                {result.job && (
                  <Link href={`${base}/jobs/${result.job.slug}`}
                    className="border-2 border-rc-teal text-rc-teal font-bold text-[16px] rounded-full px-6 py-3 hover:bg-rc-teal-soft transition-colors">
                    {result.info.label}の詳細を見る
                  </Link>
                )}
                <Link href={`${base}/entry`}
                  className="bg-rc-teal text-white font-bold text-[16px] rounded-full px-7 py-3 hover:bg-rc-teal-dark transition-colors shadow-md shadow-rc-teal/25">
                  この結果で応募する
                </Link>
              </div>
              <button onClick={restart} className="mt-5 text-[14px] text-rc-ink-soft hover:text-rc-teal underline underline-offset-4">
                もう一度診断する
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* 4. 職種から探す（v2の中心：職種別ページへのハブ） */
function JobsIndex() {
  const { jobs, slug } = useClinic();
  const base = `/recruit/${slug}`;
  return (
    <section id="jobs" className="bg-rc-teal-dark scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-14 md:py-20">
        <div className="mb-8">
          <div className="text-[14px] tracking-[0.16em] text-rc-teal-soft font-bold">募集職種</div>
          <h2 className="rc-mincho text-[22px] md:text-[32px] font-semibold text-white mt-1.5">
            {jobs.length === 1 ? `${jobs[0].title}を募集しています` : `現在、${jobs.length}件の求人を募集しています`}
          </h2>
        </div>
        <div className={
          jobs.length === 1 ? 'grid max-w-xl'
            : jobs.length === 2 ? 'grid md:grid-cols-2 gap-4 max-w-4xl'
            : 'grid md:grid-cols-3 gap-4'
        }>
          {jobs.map((j, i) => (
            <Reveal key={j.slug} delay={i * 110}>
            <Link href={`${base}/jobs/${j.slug}`}
              className="group rounded-2xl bg-white p-6 hover:-translate-y-1 transition-transform shadow-sm block h-full">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-rc-ink">{j.title}</h3>
                <div className="flex gap-1">
                  {j.employmentTypes.map(e => (
                    <span key={e.type} className="text-[12px] font-bold text-rc-teal bg-rc-teal-soft rounded px-1.5 py-0.5">{e.type}</span>
                  ))}
                </div>
              </div>
              <p className="rc-mincho text-[17px] text-rc-teal-dark mt-3 leading-relaxed">{j.catch}</p>
              <p className="text-[15px] text-rc-ink-soft mt-3 leading-relaxed line-clamp-3">{j.summary}</p>
              <div className="mt-5 text-[15px] font-bold text-rc-teal flex items-center gap-1">
                仕事内容と募集要項を見る
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 4.5 院内ギャラリー（clinic.gallery がある場合のみ表示） */
function Gallery() {
  const { clinic } = useClinic();
  if (!clinic.gallery?.length) return null;
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 py-14 md:py-20">
      <Eyebrow en="ギャラリー" ja="院内の様子" />
      <div className="grid md:grid-cols-2 gap-5 mt-8">
        {clinic.gallery.map((g, i) => (
          <Reveal key={g.src} delay={i * 110}>
            <figure>
              <div className="group/g relative overflow-hidden rounded-xl aspect-[16/10] bg-rc-sand">
                <img
                  src={asset(g.src)}
                  alt={g.caption}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover/g:scale-[1.04]"
                />
              </div>
              <figcaption className="text-[15px] text-rc-ink-soft mt-2.5">{g.caption}</figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* 5. スタッフの声 */
function Voices() {
  const { voices } = useClinic();
  if (!voices || voices.length === 0) return null;
  return (
    <section id="voice" className="max-w-6xl mx-auto px-4 md:px-6 py-14 md:py-20 scroll-mt-20">
      <Eyebrow en="スタッフの声" ja="先に働いている人の、正直な話。" />
      <div className="mt-8 max-w-3xl mx-auto space-y-6">
        {voices.map((v, i) => (
          <Reveal key={v.id} delay={i * 110} as="article" className={`rounded-2xl bg-white border border-rc-sand overflow-hidden ${v.photo ? 'grid sm:grid-cols-[240px_1fr]' : ''}`}>
            {v.photo && <Photo label={v.photoLabel} scene={v.scene} src={v.photo} ratio="aspect-[4/3] sm:aspect-auto sm:h-full sm:min-h-[280px]" className="!rounded-none" />}
            <div className="p-6 md:p-7 flex flex-col">
              <div className="text-[14px] text-rc-ink-soft">{v.role}・{v.years}</div>
              <h3 className="rc-mincho text-[18px] text-rc-teal-dark leading-relaxed mt-2">「{v.headline || v.reason.slice(0, 34) + '…'}」</h3>
              <dl className="mt-4 space-y-3 text-[15px] leading-relaxed">
                <div>
                  <dt className="font-bold text-rc-teal">入職の決め手</dt>
                  <dd className="text-rc-ink-soft mt-0.5">{v.reason}</dd>
                </div>
                <div>
                  <dt className="font-bold text-rc-teal">働いてみて</dt>
                  <dd className="text-rc-ink-soft mt-0.5">{v.gap}</dd>
                </div>
              </dl>
              <p className="mt-4 pt-4 border-t border-rc-sand text-[15px] text-rc-ink">
                <span className="font-bold">応募を考えている方へ：</span>{v.message}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* 6. 教育・福利厚生：「制度名＋期間」で具体に */
function Support() {
  const { support } = useClinic();
  if (!support) return null;
  return (
    <section className="bg-white border-y border-rc-sand">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-14 md:py-20">
        <Eyebrow en="教育・福利厚生" ja="「ついていけるかな」を、制度でなくす。" />
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {support.education.map((e, i) => (
            <Reveal key={e.title} delay={i * 100}>
              <div className="rounded-xl border border-rc-sand bg-rc-ivory p-6 h-full">
                <div className="text-[13px] tracking-[0.2em] text-rc-teal font-bold">サポート {String(i + 1).padStart(2, '0')}</div>
                <h3 className="font-bold text-[17px] mt-2">{e.title}</h3>
                <p className="text-[15px] text-rc-ink-soft leading-relaxed mt-2">{e.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <ul className="flex flex-wrap gap-2 mt-6" aria-label="福利厚生">
          {support.benefits.map(b => (
            <li key={b} className="text-[14px] font-medium bg-rc-ivory border border-rc-sand rounded-full px-3.5 py-1.5 text-rc-ink-soft">
              {b}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* 8. 見学・応募の流れ（抜粋） */
function FlowDigest() {
  const { flowSteps, hasTour, slug } = useClinic();
  const base = `/recruit/${slug}`;
  return (
    <section className="bg-white border-y border-rc-sand">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-14 md:py-20">
        <Eyebrow en="応募の流れ" ja="入職まで、最短2週間。" />
        <ol className="grid md:grid-cols-4 gap-4 mt-8">
          {flowSteps.map((s, i) => (
            <Reveal key={s.step} delay={i * 110} as="li" className={`rounded-xl p-5 border ${s.chat ? 'bg-rc-teal-soft border-rc-teal/40' : 'bg-rc-ivory border-rc-sand'}`}>
              <div className={`text-[13px] tracking-[0.2em] font-bold ${s.chat ? 'text-rc-teal' : 'text-rc-ink-soft'}`}>{s.step}</div>
              <h3 className="font-bold text-[17px] mt-1.5">{s.title}</h3>
              <p className="text-[15px] text-rc-ink-soft leading-relaxed mt-2">{s.text}</p>
            </Reveal>
          ))}
        </ol>
        <div className="mt-8">
          <Link href={`${base}/flow`} className="text-[16px] font-bold text-rc-teal hover:underline underline-offset-4">
            {hasTour ? '見学当日の流れをくわしく見る →' : '応募から入職までをくわしく見る →'}
          </Link>
        </div>
      </div>
    </section>
  );
}

/* 9. FAQ：チャットとナレッジ共通。解決しなければチャットへ */
function Faq() {
  const { clinic, faqs } = useClinic();
  const { openChat } = useRecruitChat();
  return (
    <section id="faq" className="max-w-3xl mx-auto px-4 md:px-6 py-14 md:py-20 scroll-mt-20">
      <Eyebrow en="よくある質問" ja="気になることには、先に答えます。" />
      <div className="mt-6 divide-y divide-rc-sand border-y border-rc-sand">
        {faqs.map(f => (
          <details key={f.q} className="group py-1">
            <summary className="flex items-center gap-3 cursor-pointer list-none py-4 text-[17px] font-bold hover:text-rc-teal transition-colors">
              <span className="rc-mincho text-rc-teal text-lg shrink-0" aria-hidden="true">Q</span>
              <span className="flex-1">{f.q}</span>
              <span className="text-rc-ink-soft transition-transform group-open:rotate-45 text-xl leading-none" aria-hidden="true">＋</span>
            </summary>
            <p className="pl-8 pb-5 text-[16px] leading-7 text-rc-ink-soft">{f.a}</p>
          </details>
        ))}
      </div>
      {!clinic.chatWidget && (
        <p className="mt-6 text-[16px] text-rc-ink-soft">
          解決しませんでしたか？
          <button onClick={() => openChat()} className="ml-2 font-bold text-rc-teal underline underline-offset-4 decoration-rc-teal/40 hover:decoration-rc-teal">
            チャットで質問する（匿名OK）
          </button>
        </p>
      )}
    </section>
  );
}

/* 10. クロージングCTA */
function Closing() {
  const { clinic, hasTour, slug } = useClinic();
  const { openChat } = useRecruitChat();
  const base = `/recruit/${slug}`;
  return (
    <section className="bg-rc-teal">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-20 text-center">
        <h2 className="rc-mincho text-[22px] md:text-[32px] font-semibold text-white leading-snug" style={{ textWrap: 'balance' }}>
          {breakAtComma(hasTour ? 'まずは30分、見学だけでも。' : '迷ったら、まず聞くだけでも。')}
        </h2>
        <p className="text-white/80 text-[16px] mt-3">
          {hasTour
            ? '私服OK。職場の空気を見てから決めてください。'
            : clinic.applyByPhone === false
              ? 'フォームは1分で完了。応募前のご相談も歓迎です。'
              : 'フォームは1分・お電話でもOK。応募前のご相談も歓迎です。'}
        </p>
        <div className="flex flex-wrap justify-center items-center gap-3 mt-8">
          <Link href={`${base}/entry`}
            className="bg-white text-rc-teal font-bold text-[17px] rounded-full px-8 py-3.5 hover:bg-rc-ivory transition-colors">
            {hasTour ? '応募・見学を予約する' : '応募する'}
          </Link>
          {!clinic.chatWidget && (
            <button onClick={() => openChat()}
              className="inline-flex items-center gap-2 border-2 border-white/70 text-white font-bold text-[17px] rounded-full px-7 py-3 hover:bg-white/10 transition-colors">
              <ChatIcon className="w-5 h-5" /> その前に相談する
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export function getStaticPaths() {
  return { paths: CLINIC_SLUGS.map(clinic => ({ params: { clinic } })), fallback: false };
}

export function getStaticProps({ params }) {
  const bundle = getClinicBundle(params.clinic);
  if (!bundle) return { notFound: true };
  return { props: { bundle } };
}

export default function RecruitTop({ bundle }) {
  return (
    <RecruitLayout bundle={bundle}>
      <Hero />
      <Stats />
      <Director />
      <Policies />
      <Signature />
      <Diagnosis />
      <JobsIndex />
      <Gallery />
      <Voices />
      <Support />
      <FlowDigest />
      <Faq />
      <Closing />
    </RecruitLayout>
  );
}
