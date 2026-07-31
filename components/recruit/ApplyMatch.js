import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useClinic } from '../../lib/recruit/clinic-context';

// 応募マッチ：職種選択 → 必須ゲート（合否）→ プロフィール質問 → 合格者のみ応募入力 → 採用担当メールへ送信。
// 回答するたびに下へ入力ブロックが積み上がる（プログレッシブ開示）UIで、応募のハードルを下げる。
export default function ApplyMatch() {
  const { applyMatch, clinic, slug } = useClinic();
  const base = `/recruit/${slug}`;
  const [started, setStarted] = useState(false);
  const [jobKey, setJobKey] = useState(null);
  const [gateAns, setGateAns] = useState([]);        // ゲート回答（option）
  const [failInfo, setFailInfo] = useState(null);    // { reason, redirect: [] }
  const [profileAns, setProfileAns] = useState([]);  // プロフィール回答（option）
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');      // idle | submitting | done | error
  const bottomRef = useRef(null);

  // 新しいブロックが出るたびに最下部を視界に入れる
  useEffect(() => {
    if (started) bottomRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [started, jobKey, gateAns.length, failInfo, profileAns.length, status]);

  if (!applyMatch) return null;
  const jobs = applyMatch.jobs || [];
  const job = jobs.find(j => j.key === jobKey) || null;

  const gatesDone = job && !failInfo && gateAns.length === job.gates.length;
  const passed = Boolean(gatesDone);
  const hasProfile = passed && job.profile && job.profile.length > 0;
  const profileDone = passed && (!hasProfile || profileAns.length === job.profile.length);
  const readyToApply = profileDone;

  // 医師は最初のプロフィール回答で常勤/非常勤の詳細slugが決まる
  const effectiveSlug = (job && job.key === 'doctor' && profileAns[0]?.slug) ? profileAns[0].slug : (job?.slug || '');

  // 充足度（人事向け）
  const fulfillment = (() => {
    if (!passed || !job.fulfillment) return null;
    const pts = profileAns.reduce((s, a) => s + (a?.pts || 0), 0);
    const lvl = job.fulfillment.find(f => pts >= f.min);
    return lvl ? lvl.level : null;
  })();

  const selectJob = (k) => {
    setJobKey(k); setGateAns([]); setFailInfo(null); setProfileAns([]);
    setForm({}); setErrors({}); setStatus('idle');
  };
  const restart = () => { setStarted(true); selectJob(null); };

  const answerGate = (idx, opt) => {
    const next = gateAns.slice(0, idx); next[idx] = opt; setGateAns(next);
    setFailInfo(opt.pass === false ? { reason: opt.reason, redirect: opt.redirect || [] } : null);
    setProfileAns([]); setStatus('idle');
  };
  const answerProfile = (idx, opt) => {
    const next = profileAns.slice(0, idx); next[idx] = opt; setProfileAns(next);
  };
  // 過去のゲート/プロフィール回答をやり直す（そのステップ以降を破棄）
  const editGate = (idx) => { setGateAns(gateAns.slice(0, idx)); setFailInfo(null); setProfileAns([]); setStatus('idle'); };
  const editProfile = (idx) => { setProfileAns(profileAns.slice(0, idx)); setStatus('idle'); };

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
      ...gateAns.map((a, i) => ({ q: job.gates[i].q, a: a.label })),
      ...profileAns.map((a, i) => ({ q: job.profile[i].q, a: a.label })),
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
        // Apps Script ウェブアプリへ送信（CORSプリフライトを避けるため text/plain + no-cors）
        await fetch(applyMatch.endpoint, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
        });
        setStatus('done');
      } else {
        // 送信先未設定時は、その職種の応募フォームを開くフォールバック
        const url = job.applyFormUrl || clinic.applyFormUrl;
        if (url && typeof window !== 'undefined') window.open(url, '_blank', 'noopener,noreferrer');
        setStatus('done');
      }
    } catch {
      setStatus('error');
    }
  };

  const currentGateIdx = (job && !failInfo) ? gateAns.length : -1;
  const currentProfileIdx = hasProfile ? profileAns.length : -1;

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

              {/* ゲート（回答済みは要約、現在は質問） */}
              {job && gateAns.map((a, i) => (
                <SummaryRow key={`g${i}`} label={`Q${i + 1}`} value={a.label} onEdit={() => editGate(i)} />
              ))}
              {currentGateIdx >= 0 && currentGateIdx < job.gates.length && (
                <QuestionBlock
                  label={`STEP 2 ・ 応募資格`}
                  q={job.gates[currentGateIdx].q}
                  options={job.gates[currentGateIdx].options}
                  onPick={(opt) => answerGate(currentGateIdx, opt)}
                />
              )}

              {/* 不合格 */}
              {failInfo && (
                <div className="rounded-xl border-2 border-rc-apricot/50 bg-rc-apricot/5 p-5 rc-appear">
                  <div className="inline-flex items-center gap-2 text-rc-apricot font-bold text-[15px]">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rc-apricot text-white text-[13px]">×</span>
                    {applyMatch.failTitle}
                  </div>
                  <p className="text-[15px] text-rc-ink mt-2 leading-relaxed">{applyMatch.failLead}</p>
                  <p className="text-[14px] text-rc-ink-soft mt-1">{failInfo.reason}</p>
                  {failInfo.redirect && failInfo.redirect.length > 0 && (
                    <div className="mt-4">
                      <p className="text-[14px] font-bold text-rc-ink">未経験OKのこちらなら、今すぐ応募できます：</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {failInfo.redirect.map(k => {
                          const rj = jobs.find(j => j.key === k);
                          return rj ? (
                            <button key={k} onClick={() => selectJob(k)}
                              className="text-[15px] font-bold text-rc-teal bg-rc-teal-soft rounded-full px-4 py-2 hover:bg-rc-teal hover:text-white transition-colors">
                              {rj.label}で試す
                            </button>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                  <button onClick={restart} className="mt-4 text-[13px] text-rc-ink-soft hover:text-rc-teal underline underline-offset-4">職種を選び直す</button>
                </div>
              )}

              {/* 合格バナー */}
              {passed && (
                <div className="rounded-xl border-2 border-rc-teal/40 bg-rc-teal-soft/60 p-5 rc-appear">
                  <div className="inline-flex items-center gap-2 text-rc-teal-dark font-bold text-[16px]">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rc-teal text-white text-[14px]">✓</span>
                    合格：応募資格を満たしています
                  </div>
                  <p className="text-[15px] text-rc-ink mt-2 leading-relaxed">{job.passMessage}</p>
                  <Link href={`${base}/jobs/${effectiveSlug}`} className="inline-block mt-2 text-[14px] font-bold text-rc-teal underline underline-offset-4 hover:text-rc-teal-dark">
                    {job.label}の募集要項を見る →
                  </Link>
                </div>
              )}

              {/* プロフィール質問（回答済みは要約、現在は質問） */}
              {passed && hasProfile && profileAns.map((a, i) => (
                <SummaryRow key={`p${i}`} label={`Q${i + 1}`} value={a.label} onEdit={() => editProfile(i)} />
              ))}
              {passed && currentProfileIdx >= 0 && currentProfileIdx < job.profile.length && (
                <QuestionBlock
                  label={`STEP 3 ・ あなたについて`}
                  q={job.profile[currentProfileIdx].q}
                  options={job.profile[currentProfileIdx].options}
                  onPick={(opt) => answerProfile(currentProfileIdx, opt)}
                />
              )}

              {/* 応募入力（合格者のみ） */}
              {readyToApply && status !== 'done' && (
                <form onSubmit={submit} className="rounded-xl border border-rc-teal/30 bg-white p-5 md:p-6 rc-appear" noValidate>
                  <div className="text-[14px] font-bold text-rc-teal">STEP 4 ・ 応募入力</div>
                  <p className="text-[14px] text-rc-ink-soft mt-1 leading-relaxed">{applyMatch.applyLead}</p>
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
