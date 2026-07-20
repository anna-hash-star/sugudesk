import { useState } from 'react';
import { clinic, jobs } from '../../lib/recruit/site-data';

// LP内に埋め込む自作の応募フォーム（履歴書・職務経歴書アップロード付き）。
// 送信先は clinic.applyForm.endpoint（Google Apps Script Web App）。応募者のログインは不要。
// ファイルは base64 で JSON に載せ、CORSプリフライトを避けるため text/plain・no-cors で POST する。
const MAX_MB = 8;
const ACCEPT = '.pdf,.jpg,.jpeg,.png,.doc,.docx';

function readAsBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => { const s = String(r.result); resolve(s.slice(s.indexOf(',') + 1)); };
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

function FileField({ id, label, required, file, onPick, error }) {
  return (
    <div>
      <label className="block text-[15px] font-bold mb-1.5">
        {label} {required ? <span className="text-rc-apricot">必須</span> : <span className="text-rc-ink-soft font-medium text-[13px]">任意</span>}
      </label>
      <label htmlFor={id} className={`flex items-center gap-3 w-full rounded-xl border border-dashed bg-white px-4 py-3.5 cursor-pointer transition-colors hover:border-rc-teal ${error ? 'border-rc-apricot' : 'border-rc-sand'}`}>
        <span className="shrink-0 inline-flex items-center gap-1.5 text-[14px] font-bold text-rc-teal">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
          ファイルを選択
        </span>
        <span className="text-[14px] text-rc-ink-soft truncate">{file ? file.name : `PDF・画像（${MAX_MB}MBまで）`}</span>
        <input id={id} type="file" accept={ACCEPT} className="sr-only" onChange={e => onPick(e.target.files[0] || null)} />
      </label>
      {error && <p className="text-[14px] text-rc-apricot mt-1.5" role="alert">{error}</p>}
    </div>
  );
}

export default function RecruitApplyForm() {
  const cfg = clinic.applyForm || {};
  const [form, setForm] = useState({ name: '', contact: '', job: '', note: '' });
  const [resume, setResume] = useState(null);
  const [cv, setCv] = useState(null);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const jobOptions = (jobs || []).filter(j => !j.pending).map(j => j.title);

  const validate = () => {
    const er = {};
    if (!form.name.trim()) er.name = 'お名前をご入力ください';
    if (!form.contact.trim()) er.contact = '電話番号またはメールアドレスをご入力ください';
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
    if (Object.keys(er).length) return;
    if (!cfg.endpoint) { setStatus('error'); return; }
    setStatus('sending');
    try {
      const files = [];
      if (resume) files.push({ label: '履歴書', filename: resume.name, mimeType: resume.type, dataBase64: await readAsBase64(resume) });
      if (cv) files.push({ label: '職務経歴書', filename: cv.name, mimeType: cv.type, dataBase64: await readAsBase64(cv) });
      const payload = { clinic: clinic.name, name: form.name, contact: form.contact, job: form.job, note: form.note, files };
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

  return (
    <form onSubmit={submit} className="rounded-2xl border border-rc-sand bg-white p-6 md:p-8 space-y-5" noValidate>
      <div>
        <label htmlFor="af-name" className="block text-[15px] font-bold mb-1.5">お名前 <span className="text-rc-apricot">必須</span></label>
        <input id="af-name" value={form.name} onChange={set('name')} className={inputClass('name')} placeholder="山田 花子" autoComplete="name" />
        {errors.name && <p className="text-[14px] text-rc-apricot mt-1.5" role="alert">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="af-contact" className="block text-[15px] font-bold mb-1.5">電話番号 または メールアドレス <span className="text-rc-apricot">必須</span></label>
        <input id="af-contact" value={form.contact} onChange={set('contact')} className={inputClass('contact')} placeholder="090-1234-5678 / hanako@example.com" autoComplete="tel email" />
        {errors.contact && <p className="text-[14px] text-rc-apricot mt-1.5" role="alert">{errors.contact}</p>}
      </div>

      {jobOptions.length > 0 && (
        <div>
          <label htmlFor="af-job" className="block text-[15px] font-bold mb-1.5">希望職種 <span className="text-rc-ink-soft font-medium text-[13px]">任意</span></label>
          <select id="af-job" value={form.job} onChange={set('job')} className={inputClass('job')}>
            <option value="">選択してください</option>
            {jobOptions.map(t => <option key={t} value={t}>{t}</option>)}
            <option value="その他・まだ決めていない">その他・まだ決めていない</option>
          </select>
        </div>
      )}

      <FileField id="af-resume" label="履歴書" required file={resume} onPick={setResume} error={errors.resume} />
      <FileField id="af-cv" label="職務経歴書" file={cv} onPick={setCv} error={errors.cv} />

      <div>
        <label htmlFor="af-note" className="block text-[15px] font-bold mb-1.5">志望動機・ご質問 <span className="text-rc-ink-soft font-medium text-[13px]">任意</span></label>
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
