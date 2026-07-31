import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useClinic } from '../../lib/recruit/clinic-context';

// 紙吹雪（合格演出）。ランダムを使わず固定配置でチラつき・ハイドレーション差異を防ぐ。
const CONFETTI = [
  { left: '6%', bg: '#C24C7E', delay: '0s', dur: '1.5s' },
  { left: '18%', bg: '#F3C8DA', delay: '.12s', dur: '1.7s' },
  { left: '30%', bg: '#E8C36B', delay: '.05s', dur: '1.6s' },
  { left: '42%', bg: '#C24C7E', delay: '.2s', dur: '1.8s' },
  { left: '54%', bg: '#F7DCE8', delay: '.08s', dur: '1.5s' },
  { left: '66%', bg: '#E8C36B', delay: '.16s', dur: '1.7s' },
  { left: '78%', bg: '#F3C8DA', delay: '.02s', dur: '1.6s' },
  { left: '90%', bg: '#C24C7E', delay: '.22s', dur: '1.8s' },
];

// 応募マッチ：職種選択 → 事前質問（合否に影響しない）→ 必須ゲート（合否）→ 合格者はその場で応募入力。
// 回答するたびに下へ入力ブロックが積み上がる（プログレッシブ開示）UIで、応募のハードルを下げる。
export default function ApplyMatch() {
  const { applyMatch, clinic, slug } = useClinic();
  const base = `/recruit/${slug}`;
  const [started, setStarted] = useState(false);
  const [jobKey, setJobKey] = useState(null);
  const [preAns, setPreAns] = useState([]);          // 事前質問の回答
  const [gateAns, setGateAns] = useState([]);        // ゲート回答（合否）
  const [failInfo, setFailInfo] = useState(null);    // { reason }
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');      // idle | submitting | done | error
  const bottomRef = useRef(null);

  useEffect(() => {
    if (started) bottomRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [started, jobKey, preAns.length, gateAns.length, failInfo, status]);

  if (!applyMatch) return null;
  const jobs = applyMatch.jobs || [];
  const job = jobs.find(j => j.key === jobKey) || null;
  const pre = job?.pre || [];
  const gates = job?.gates || [];

  const preDone = job && preAns.length === pre.length;
  const gatesDone = preDone && !failInfo && gateAns.length === gates.length;
  const passed = Boolean(gatesDone);
  const readyToApply = passed;

  // 医師は最初の事前回答で常勤/非常勤の詳細slugが決まる
  const effectiveSlug = (job && job.key === 'doctor' && preAns[0]?.slug) ? preAns[0].slug : (job?.slug || '');

  // 充足度（人事向け・事前質問の pts 合計から算出）
  const fulfillment = (() => {
    if (!passed || !job.fulfillment) return null;
    const pts = preAns.reduce((s, a) => s + (a?.pts || 0), 0);
    const lvl = job.fulfillment.find(f => pts >= f.min);
    return lvl ? lvl.level : null;
  })();

  const selectJob = (k) => {
    setJobKey(k); setPreAns([]); setGateAns([]); setFailInfo(null);
    setForm({}); setErrors({}); setStatus('idle');
  };
  const restart = () => { setStarted(true); selectJob(null); };

  const answerPre = (idx, opt) => {
    const next = preAns.slice(0, idx); next[idx] = opt; setPreAns(next);
    setGateAns([]); setFailInfo(null); setStatus('idle');
  };
  const answerGate = (idx, opt) => {
    const next = gateAns.slice(0, idx); next[idx] = opt; setGateAns(next);
    setFailInfo(opt.pass === false ? { reason: opt.reason } : null);
    setStatus('idle');
  };
  const editPre = (idx) => { setPreAns(preAns.slice(0, idx)); setGateAns([]); setFailInfo(null); setStatus('idle'); };
  const editGate = (idx) => { setGateAns(gateAns.slice(0, idx)); setFailInfo(null); setStatus('idle'); };

  const validate = () => {
    const e = {};
    for (const f of applyMatch.applyFields) {
      if (f.required && !String(form[f.key] || '').trim()) e[f.key] = '入力してください';
    }
    if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = 'メールアドレスの形式で入力してください';
    return e;
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate(); setErrors(errs);
    if (Object.keys(errs).length) return;
    const answers = [
      ...preAns.map((a, i) => ({ q: pre[i].q, a: a.label })),
      ...gateAns.map((a, i) => ({ q: gates[i].q, a: a.label })),
    ];
    const payload = {
      clinic: slug,
      clinicName: clinic.name,
      job: { key: job.key, label: job.label, slug: effectiveSlug },
      result: '合格',
      fulfillment,
      answers,
      applicant: { ...form },
      submittedFrom: typeof window !== 'undefined' ? window.location.href : '',
    };
    setStatus('submitting');
    try {
      if (applyMatch.endpoint) {
        await fetch(applyMatch.endpoint, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
        });
      }
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  const currentPreIdx = job ? preAns.length : -1;
  const currentGateIdx = (preDone && !failInfo) ? gateAns.length : -1;

  return (
    <section id="match" className="bg-rc-teal-soft/50 border-y border-rc-sand scroll-mt-20">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-14 md:py-20">
        <div className="text-center">
          <div className="text-[14px] tracking-[0.16em] text-rc-teal font-bold">{applyMatch.eyebrow}</div>
          <h2 className="rc-mincho text-[22px] md:text-[32px] font-semibold text-rc-ink mt-1.5">{applyMatch.title}</h2>
          <p className="text-[16px] text-rc-ink-soft mt-3">{applyMatch.lead}</p>
        </div>

        <div className="mt-8 rounded-2xl bg-white border border-rc-sand shadow-sm p-5 md:p-8">
          {!started ? (
            <div className="text-center py-6">
              <button onClick={restart}
                className="bg-rc-teal text-white font-bold text-[17px] rounded-full px-8 py-3.5 hover:bg-rc-teal-dark transition-colors shadow-md shadow-rc-teal/25">
                {applyMatch.startCta}
              </button>
              <p className="text-[13px] text-rc-ink-soft mt-4 max-w-md mx-auto leading-relaxed">{applyMatch.disclaimer}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* 職種選択 */}
              {!jobKey ? (
                <Block label="STEP 1">
                  <h3 className="rc-mincho text-[19px] md:text-[21px] font-semibold text-rc-ink text-center">{applyMatch.selectLead}</h3>
                  <div className="grid sm:grid-cols-2 gap-3 mt-5">
                    {jobs.map(j => (
                      <button key={j.key} onClick={() => selectJob(j.key)}
                        className="text-left rounded-xl border border-rc-sand bg-rc-ivory px-5 py-4 hover:border-rc-teal hover:bg-rc-teal-soft transition-colors">
                        <div className="text-[17px] font-bold text-rc-ink">{j.label}</div>
                        {j.note && <div className="text-[13px] text-rc-ink-soft mt-1">{j.note}</div>}
                      </button>
                    ))}
                  </div>
                </Block>
              ) : (
                <SummaryRow label="職種" value={job.label} onEdit={restart} />
              )}

              {/* 事前質問（合否に影響しない） */}
              {job && preAns.map((a, i) => (
                <SummaryRow key={`pre${i}`} label={`Q${i + 1}`} value={a.label} onEdit={() => editPre(i)} />
              ))}
              {currentPreIdx >= 0 && currentPreIdx < pre.length && (
                <QuestionBlock
                  label="STEP 2 ・ あなたについて"
                  q={pre[currentPreIdx].q}
                  options={pre[currentPreIdx].options}
                  onPick={(opt) => answerPre(currentPreIdx, opt)}
                />
              )}

              {/* ゲート（合否） */}
              {preDone && gateAns.map((a, i) => (
                <SummaryRow key={`g${i}`} label={`必須${i + 1}`} value={a.label} onEdit={() => editGate(i)} />
              ))}
              {currentGateIdx >= 0 && currentGateIdx < gates.length && (
                <QuestionBlock
                  label="STEP 3 ・ 応募資格の確認"
                  q={gates[currentGateIdx].q}
                  options={gates[currentGateIdx].options}
                  onPick={(opt) => answerGate(currentGateIdx, opt)}
                />
              )}

              {/* 応募条件を満たさない場合（「不合格」の語は使わず、条件ベースで穏当に。誘導はしない） */}
              {failInfo && (
                <div className="rounded-xl border border-rc-sand bg-rc-ivory p-5 rc-appear">
                  <div className="inline-flex items-center gap-2 text-rc-ink font-bold text-[15px]">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rc-ink-soft text-white text-[13px]">!</span>
                    {applyMatch.failTitle}
                  </div>
                  <p className="text-[14px] text-rc-ink-soft mt-2 leading-relaxed">{failInfo.reason}</p>
                  <button onClick={restart} className="mt-4 text-[13px] text-rc-ink-soft hover:text-rc-teal underline underline-offset-4">職種を選び直す</button>
                </div>
              )}

              {/* 合格（大きく・うれしく・動的に） */}
              {passed && (
                <div className="relative overflow-hidden rounded-2xl border-2 border-rc-teal/40 bg-gradient-to-b from-rc-teal-soft to-white px-5 py-8 text-center rc-pop">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-40" aria-hidden="true">
                    {CONFETTI.map((c, i) => (
                      <span key={i} className="rc-confetti"
                        style={{ left: c.left, background: c.bg, animationDelay: c.delay, animationDuration: c.dur }} />
                    ))}
                  </div>
                  <div className="relative">
                    <div className="flex items-center justify-center gap-2.5">
                      <svg className="rc-bounce shrink-0" width="42" height="42" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M7 41 L25 23 L31 29 Z" fill="#C24C7E" />
                        <path d="M7 41 L13 35 L16 38 Z" fill="#ffffff" opacity="0.5" />
                        <path d="M27 22 C 33 12, 40 9, 44 9" fill="none" stroke="#F3C8DA" strokeWidth="2.2" strokeLinecap="round" />
                        <path d="M30 26 C 37 20, 42 19, 45 20" fill="none" stroke="#C24C7E" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
                        <circle cx="33" cy="11" r="2.3" fill="#E8C36B" />
                        <circle cx="42" cy="15" r="1.7" fill="#C24C7E" />
                        <rect x="24" y="9" width="3.4" height="3.4" rx="0.7" fill="#F3C8DA" transform="rotate(18 25.7 10.7)" />
                        <rect x="39" y="26" width="3" height="3" rx="0.6" fill="#E8C36B" transform="rotate(24 40.5 27.5)" />
                      </svg>
                      <div className="rc-mincho text-[30px] md:text-[40px] font-bold text-rc-teal-dark">{applyMatch.passTitle}</div>
                    </div>
                    <p className="text-[17px] md:text-[18px] font-bold text-rc-ink mt-2">{applyMatch.passSub}</p>
                    <p className="text-[14px] text-rc-ink-soft mt-3 max-w-md mx-auto leading-relaxed">{job.passMessage}</p>
                    <Link href={`${base}/jobs/${effectiveSlug}`} className="inline-block mt-3 text-[14px] font-bold text-rc-teal underline underline-offset-4 hover:text-rc-teal-dark">
                      {job.label}の募集要項を見る →
                    </Link>
                  </div>
                </div>
              )}

              {/* 応募入力（合格者のみ・その場で氏名/連絡先） */}
              {readyToApply && status !== 'done' && (
                <form onSubmit={submit} className="rounded-xl border border-rc-teal/30 bg-white p-5 md:p-6 rc-appear" noValidate>
                  <div className="text-[14px] font-bold text-rc-teal">STEP 4 ・ 応募入力</div>
                  <p className="text-[14px] text-rc-ink-soft mt-1 leading-relaxed whitespace-pre-line">{applyMatch.applyLead}</p>
                  <div className="mt-5 space-y-4">
                    {applyMatch.applyFields.map(f => (
                      <div key={f.key}>
                        <label htmlFor={`am-${f.key}`} className="block text-[14px] font-bold mb-1.5">
                          {f.label} {f.required && <span className="text-rc-apricot">必須</span>}
                        </label>
                        {f.type === 'textarea' ? (
                          <textarea id={`am-${f.key}`} rows={3} value={form[f.key] || ''}
                            onChange={e => setForm(s => ({ ...s, [f.key]: e.target.value }))}
                            className={inputCls(errors[f.key])} />
                        ) : (
                          <input id={`am-${f.key}`} type={f.type} placeholder={f.placeholder} autoComplete={f.autoComplete}
                            value={form[f.key] || ''} onChange={e => setForm(s => ({ ...s, [f.key]: e.target.value }))}
                            className={inputCls(errors[f.key])} />
                        )}
                        {errors[f.key] && <p className="text-[13px] text-rc-apricot mt-1" role="alert">{errors[f.key]}</p>}
                      </div>
                    ))}
                  </div>
                  {status === 'error' && (
                    <p className="text-[14px] text-rc-apricot mt-3" role="alert">送信に失敗しました。時間をおいて再度お試しください。</p>
                  )}
                  <button type="submit" disabled={status === 'submitting'}
                    className="w-full mt-5 bg-rc-teal text-white font-bold text-[17px] rounded-full py-4 hover:bg-rc-teal-dark transition-colors shadow-md shadow-rc-teal/25 disabled:opacity-60">
                    {status === 'submitting' ? '送信中…' : applyMatch.applyCta}
                  </button>
                  <p className="text-[12px] text-rc-ink-soft text-center mt-3 leading-relaxed">{applyMatch.disclaimer}</p>
                </form>
              )}

              {/* 送信完了 */}
              {status === 'done' && (
                <div className="rounded-xl border-2 border-rc-teal/40 bg-rc-teal-soft/60 p-6 text-center rc-appear">
                  <div className="w-12 h-12 rounded-full bg-rc-teal text-white flex items-center justify-center mx-auto text-[22px]" aria-hidden="true">✓</div>
                  <h3 className="rc-mincho text-[20px] font-semibold text-rc-ink mt-3">{applyMatch.successTitle}</h3>
                  <p className="text-[15px] text-rc-ink-soft mt-2 leading-relaxed">{applyMatch.successMessage}</p>
                  <button onClick={restart} className="mt-5 text-[14px] text-rc-ink-soft hover:text-rc-teal underline underline-offset-4">別の職種もチェックする</button>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function inputCls(hasError) {
  return `w-full rounded-xl border bg-white px-4 py-3 text-[16px] focus:outline-none focus:ring-1 transition-colors ${
    hasError ? 'border-rc-apricot focus:border-rc-apricot focus:ring-rc-apricot' : 'border-rc-sand focus:border-rc-teal focus:ring-rc-teal'
  }`;
}

function Block({ label, children }) {
  return (
    <div className="rounded-xl border border-rc-sand bg-rc-ivory/40 p-5 rc-appear">
      <div className="text-[13px] font-bold text-rc-teal mb-3">{label}</div>
      {children}
    </div>
  );
}

function QuestionBlock({ label, q, options, onPick }) {
  return (
    <div className="rounded-xl border border-rc-teal/30 bg-white p-5 rc-appear">
      <div className="text-[13px] font-bold text-rc-teal mb-2">{label}</div>
      <h3 className="rc-mincho text-[18px] md:text-[20px] font-semibold text-rc-ink">{q}</h3>
      <div className="grid gap-2.5 mt-4">
        {options.map((o, i) => (
          <button key={i} onClick={() => onPick(o)}
            className="text-left text-[16px] font-medium rounded-xl border border-rc-sand bg-rc-ivory px-5 py-3.5 hover:border-rc-teal hover:bg-rc-teal-soft transition-colors">
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function SummaryRow({ label, value, onEdit }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-rc-sand bg-rc-ivory/60 px-4 py-3">
      <div className="flex items-center gap-2 min-w-0">
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-rc-teal/15 text-rc-teal text-[12px] shrink-0">✓</span>
        <span className="text-[13px] text-rc-ink-soft shrink-0">{label}</span>
        <span className="text-[15px] font-bold text-rc-ink truncate">{value}</span>
      </div>
      <button onClick={onEdit} className="text-[13px] font-bold text-rc-teal hover:text-rc-teal-dark shrink-0 ml-3">変更</button>
    </div>
  );
}
