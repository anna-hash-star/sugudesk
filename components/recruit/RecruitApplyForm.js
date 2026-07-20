import { useState } from 'react';
import { clinic, jobs } from '../../lib/recruit/site-data';

// LP内に埋め込む自作の応募フォーム（履歴書・職務経歴書アップロード付き）。
// 送信先は clinic.applyForm.endpoint（Google Apps Script Web App）。応募者のログインは不要。
// ファイルは base64 で JSON に載せ、CORSプリフライトを避けるため text/plain・no-cors で POST する。
const MAX_MB = 8;
const ACCEPT = '.pdf,.jpg,.jpeg,.png,.doc,.docx';
const START_OPTIONS = ['いつでも', '1ヶ月以内', '1ヶ月以上先', 'その他'];
const TIME_OPTIONS = ['午前（9-12時）', '午後（13-17時）', '夕方以降（17-20時）', 'いつでも'];

function readAsBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => { const s = String(r.result); resolve(s.slice(s.indexOf(',') + 1)); };
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

function Req() { return <span className="text-rc-apricot text-[13px] align-middle ml-1">必須</span>; }
function Opt() { return <span className="text-rc-ink-soft font-medium text-[13px] align-middle ml-1">任意</span>; }

// カード型の選択肢（single＝単一選択 / それ以外＝複数選択）
function ChoiceGroup({ options, value, onChange, multi = false, error }) {
  const selected = multi ? (value || []) : value;
  const isOn = (o) => multi ? selected.includes(o) : selected === o;
  const toggle = (o) => {
    if (multi) onChange(isOn(o) ? selected.filter(x => x !== o) : [...selected, o]);
    else onChange(o);
  };
  return (
    <>
      <div className="grid grid-cols-2 gap-2.5">
        {options.map(o => (
          <button type="button" key={o} onClick={() => toggle(o)} aria-pressed={isOn(o)}
            className={`flex items-center gap-2.5 text-left rounded-xl border px-3.5 py-3 text-[15px] transition-colors ${
              isOn(o) ? 'border-rc-teal bg-rc-teal-soft text-rc-teal-dark font-bold' : 'border-rc-sand bg-white hover:border-rc-teal/50'
            }`}>
            <span className={`shrink-0 w-5 h-5 grid place-items-center border-2 ${multi ? 'rounded' : 'rounded-full'} ${isOn(o) ? 'border-rc-teal bg-rc-teal text-white' : 'border-rc-sand'}`}>
              {isOn(o) && <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
            </span>
            {o}
          </button>
        ))}
      </div>
      {error && <p className="text-[14px] text-rc-apricot mt-1.5" role="alert">{error}</p>}
    </>
  );
}

function FileField({ id, file, onPick, error }) {
  return (
    <>
      <label htmlFor={id} className={`flex items-center gap-3 w-full rounded-xl border border-dashed bg-white px-4 py-3.5 cursor-pointer transition-colors hover:border-rc-teal ${error ? 'border-rc-apricot' : 'border-rc-sand'}`}>
        <span className="shrink-0 inline-flex items-center gap-1.5 text-[14px] font-bold text-rc-teal">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
          ファイルを選択
        </span>
        <span className="text-[14px] text-rc-ink-soft truncate">{file ? file.name : `PDF・画像（${MAX_MB}MBまで）`}</span>
        <input id={id} type="file" accept={ACCEPT} className="sr-only" onChange={e => onPick(e.target.files[0] || null)} />
      </label>
      {error && <p className="text-[14px] text-rc-apricot mt-1.5" role="alert">{error}</p>}
    </>
  );
}

export default function RecruitApplyForm() {
  const cfg = clinic.applyForm || {};
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', job: '', start: '', times: [], note: '' });
  const [resume, setResume] = useState(null);
  const [cv, setCv] = useState(null);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const setField = (k) => (v) => setForm(f => ({ ...f, [k]: v }));

  const jobOptions = (jobs || []).filter(j => !j.pending).map(j => j.title);

  const validate = () => {
    const er = {};
    if (!form.name.trim()) er.name = 'お名前をご入力ください';
    if (!form.email.trim()) er.email = 'メールアドレスをご入力ください';
    if (!form.phone.trim()) er.phone = '電話番号をご入力ください';
    if (!form.address.trim()) er.address = 'ご住所をご入力ください';
    if (!form.start) er.start = '勤務開始可能日をお選びください';
    if (!form.times.length) er.times = '連絡のつきやすい時間帯をお選びください';
    if (!resume) er.resume = '履歴書を添付してください';
    [['resume', resume], ['cv', cv]].forEach(([k, f]) => {
      if (f && f.size > MAX_MB * 1024 * 1024) er[k] = `ファイルは${MAX_MB}MB以内にしてください`;
    });
    return er;
  };

  const submit = async (e) => {
    e.preventDefault();
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) { if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    if (!cfg.endpoint) { setStatus('error'); return; }
    setStatus('sending');
    try {
      const files = [];
      if (resume) files.push({ label: '履歴書', filename: resume.name, mimeType: resume.type, dataBase64: await readAsBase64(resume) });
      if (cv) files.push({ label: '職務経歴書', filename: cv.name, mimeType: cv.type, dataBase64: await readAsBase64(cv) });
      const payload = {
        clinic: clinic.name,
        name: form.name, email: form.email, phone: form.phone, address: form.address,
        job: form.job, start: form.start, times: form.times.join('、'), note: form.note, files,
      };
      await fetch(cfg.endpoint, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });
      setStatus('done');
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <div className="rounded-2xl border border-rc-sand bg-rc-ivory px-6 py-10 text-center">
        <div className="w-14 h-14 rounded-full bg-rc-teal-soft text-rc-teal flex items-center justify-center mx-auto" aria-hidden="true">
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
        </div>
        <h3 className="rc-mincho text-2xl font-semibold mt-5">ご応募を受け付けました</h3>
        <p className="text-[15px] leading-7 text-rc-ink-soft mt-3">
          <b className="text-rc-ink">2営業日以内</b>に、担当よりご連絡します。<br className="hidden sm:block" />
          お急ぎの場合はお電話（{clinic.phone}・{clinic.recruitContact}）でも承ります。
        </p>
      </div>
    );
  }

  const inputClass = (key) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-[16px] focus:outline-none focus:ring-1 transition-colors ${
      errors[key] ? 'border-rc-apricot focus:border-rc-apricot focus:ring-rc-apricot' : 'border-rc-sand focus:border-rc-teal focus:ring-rc-teal'
    }`;
  const Label = ({ htmlFor, children }) => <label htmlFor={htmlFor} className="block text-[15px] font-bold mb-1.5">{children}</label>;
  const Err = ({ k }) => errors[k] ? <p className="text-[14px] text-rc-apricot mt-1.5" role="alert">{errors[k]}</p> : null;

  return (
    <form onSubmit={submit} className="rounded-2xl border border-rc-sand bg-white p-6 md:p-8 space-y-5" noValidate>
      <div>
        <Label htmlFor="af-name">お名前<Req /></Label>
        <input id="af-name" value={form.name} onChange={set('name')} className={inputClass('name')} placeholder="山田 花子" autoComplete="name" />
        <Err k="name" />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="af-email">メールアドレス<Req /></Label>
          <input id="af-email" type="email" value={form.email} onChange={set('email')} className={inputClass('email')} placeholder="hanako@example.com" autoComplete="email" />
          <Err k="email" />
        </div>
        <div>
          <Label htmlFor="af-phone">電話番号<Req /></Label>
          <input id="af-phone" type="tel" value={form.phone} onChange={set('phone')} className={inputClass('phone')} placeholder="090-1234-5678" autoComplete="tel" />
          <Err k="phone" />
        </div>
      </div>

      <div>
        <Label htmlFor="af-address">ご住所<Req /></Label>
        <input id="af-address" value={form.address} onChange={set('address')} className={inputClass('address')} placeholder="秋田県秋田市…" autoComplete="street-address" />
        <Err k="address" />
      </div>

      {jobOptions.length > 0 && (
        <div>
          <Label htmlFor="af-job">希望職種<Opt /></Label>
          <select id="af-job" value={form.job} onChange={set('job')} className={inputClass('job')}>
            <option value="">選択してください</option>
            {jobOptions.map(t => <option key={t} value={t}>{t}</option>)}
            <option value="その他・まだ決めていない">その他・まだ決めていない</option>
          </select>
        </div>
      )}

      <div>
        <p className="text-[15px] font-bold mb-2">勤務開始可能日<Req /></p>
        <ChoiceGroup options={START_OPTIONS} value={form.start} onChange={setField('start')} error={errors.start} />
      </div>

      <div>
        <p className="text-[15px] font-bold mb-2">連絡のつきやすい時間帯<Req /><span className="text-rc-ink-soft font-medium text-[12.5px] ml-1">（複数選択可）</span></p>
        <ChoiceGroup options={TIME_OPTIONS} value={form.times} onChange={setField('times')} multi error={errors.times} />
      </div>

      <div>
        <Label>履歴書<Req /></Label>
        <FileField id="af-resume" file={resume} onPick={setResume} error={errors.resume} />
      </div>
      <div>
        <Label>職務経歴書<Opt /></Label>
        <FileField id="af-cv" file={cv} onPick={setCv} error={errors.cv} />
      </div>

      <div>
        <Label htmlFor="af-note">志望動機・ご質問<Opt /></Label>
        <textarea id="af-note" value={form.note} onChange={set('note')} rows={4} className={inputClass('note')} placeholder="ご自由にご記入ください（未記入でもOK）" />
      </div>

      {(status === 'error' && !cfg.endpoint) && (
        <p className="text-[14px] text-rc-apricot" role="alert">送信先が未設定です。恐れ入りますが、お電話（{clinic.phone}）でご応募ください。</p>
      )}
      {(status === 'error' && cfg.endpoint) && (
        <p className="text-[14px] text-rc-apricot" role="alert">送信に失敗しました。時間をおいて再度お試しいただくか、お電話（{clinic.phone}）でご応募ください。</p>
      )}

      <button type="submit" disabled={status === 'sending'}
        className="w-full bg-rc-teal text-white font-bold text-[17px] rounded-full px-8 py-3.5 hover:bg-rc-teal-dark transition-colors shadow-md shadow-rc-teal/25 disabled:opacity-60">
        {status === 'sending' ? '送信中…' : '応募する'}
      </button>
      <p className="text-[12.5px] text-rc-ink-soft text-center">
        履歴書・職務経歴書はPDFまたは画像（各{MAX_MB}MBまで）。ご入力内容は採用選考のみに使用します。
      </p>
    </form>
  );
}
