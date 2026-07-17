import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import RecruitLayout, { hasTour } from '../../components/recruit/RecruitLayout';
import { useRecruitChat, ChatIcon } from '../../components/recruit/ChatWidget';
import ApplyForm from '../../components/recruit/ApplyForm';
import { clinic, jobs } from '../../lib/recruit/site-data';

// エントリーフォーム：必須4項目のみ・履歴書添付なし（スマホでの離脱防止）。
// 送信はデモ実装。実運用では /api/recruit-entry を作り、SuguDesk管理画面 or メール通知に接続する。
export default function EntryPage() {
  const router = useRouter();
  const { openChat } = useRecruitChat();
  const [mode, setMode] = useState('apply');
  const [form, setForm] = useState({ name: '', contact: '', job: '', timeslot: '', note: '' });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);

  // クエリを初期値に反映（?mode=tour：チャット/フローからの見学導線、?job=nurse：職種ページからの導線）
  useEffect(() => {
    if (!router.isReady) return;
    if (hasTour && router.query.mode === 'tour') setMode('tour');
    if (typeof router.query.job === 'string') {
      setForm(f => (f.job ? f : { ...f, job: router.query.job }));
    }
  }, [router.isReady, router.query.mode, router.query.job]);

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'お名前を入力してください';
    if (!form.contact.trim()) errs.contact = '電話番号またはメールアドレスを入力してください';
    if (!form.job) errs.job = '希望職種を選択してください';
    if (!form.timeslot) errs.timeslot = '連絡のつきやすい時間帯を選択してください';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    // TODO: 実運用では API に POST する
    setDone(true);
    window.scrollTo({ top: 0 });
  };

  if (done) {
    return (
      <RecruitLayout title="送信完了">
        <section className="max-w-xl mx-auto px-4 md:px-6 py-20 text-center">
          <div className="w-14 h-14 rounded-full bg-rc-teal-soft text-rc-teal flex items-center justify-center mx-auto" aria-hidden="true">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="rc-mincho text-2xl md:text-3xl font-semibold mt-6">
            {mode === 'tour' ? '見学のご予約を受け付けました' : 'ご応募を受け付けました'}
          </h1>
          <p className="text-[16px] leading-7 text-rc-ink-soft mt-4">
            <b className="text-rc-ink">2営業日以内</b>に、ご希望の時間帯にご連絡します。
            発信元は院の代表番号です。もしお急ぎの場合や補足があれば、チャットからも受け付けています。
          </p>
          <div className="flex justify-center gap-3 mt-8">
            <Link href="/recruit" className="text-[16px] font-bold text-rc-teal hover:underline underline-offset-4">採用トップへ戻る</Link>
          </div>
        </section>
      </RecruitLayout>
    );
  }

  // Googleフォームを設定している場合は、フォームを埋め込んで表示（従来の簡易フォームは使わない）
  if (clinic.applyFormUrl) {
    return (
      <RecruitLayout title="応募フォーム" description="応募フォームからご応募ください。">
        <section className="max-w-2xl mx-auto px-4 md:px-6 pt-10 md:pt-16 pb-16">
          <nav className="mb-6" aria-label="パンくず">
            <Link href="/recruit" className="inline-flex items-center gap-1.5 text-[15px] font-bold text-rc-teal hover:text-rc-teal-dark transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M11 6l-6 6 6 6" /></svg>
              採用トップへ戻る
            </Link>
          </nav>
          <h1 className="rc-mincho text-3xl font-semibold">応募フォーム</h1>
          {clinic.phone && (
            <p className="mt-4 rounded-xl bg-white border border-rc-sand px-4 py-3 text-[15px]">
              お電話でも応募できます：
              <a href={`tel:${clinic.phone}`} className="font-bold text-rc-teal mx-1" style={{ fontVariantNumeric: 'tabular-nums' }}>{clinic.phone}</a>
              （{clinic.recruitContact}）
            </p>
          )}
          <div className="mt-6"><ApplyForm height={1600} /></div>
        </section>
      </RecruitLayout>
    );
  }

  const inputClass = (key) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-[17px] focus:outline-none focus:ring-1 transition-colors ${
      errors[key] ? 'border-rc-apricot focus:border-rc-apricot focus:ring-rc-apricot' : 'border-rc-sand focus:border-rc-teal focus:ring-rc-teal'
    }`;

  const pageTitle = hasTour ? '応募・見学予約' : '応募フォーム';
  return (
    <RecruitLayout title={pageTitle} description="入力は4項目・1分で完了。選考には履歴書・職務経歴書が必要です。">
      <section className="max-w-xl mx-auto px-4 md:px-6 pt-10 md:pt-16 pb-16">
        <nav className="mb-6" aria-label="パンくず">
          <Link href="/recruit" className="inline-flex items-center gap-1.5 text-[15px] font-bold text-rc-teal hover:text-rc-teal-dark transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M11 6l-6 6 6 6" /></svg>
            採用トップへ戻る
          </Link>
          <span className="text-[14px] text-rc-ink-soft ml-3">／ {pageTitle}</span>
        </nav>
        <h1 className="rc-mincho text-3xl font-semibold">{pageTitle}</h1>
        <p className="text-[16px] text-rc-ink-soft mt-3">入力は4項目・1分で完了します。（選考には履歴書・職務経歴書をご用意ください）</p>
        {clinic.phone && (
          <p className="mt-4 rounded-xl bg-white border border-rc-sand px-4 py-3 text-[15px]">
            お電話でも応募できます：
            <a href={`tel:${clinic.phone}`} className="font-bold text-rc-teal mx-1" style={{ fontVariantNumeric: 'tabular-nums' }}>{clinic.phone}</a>
            （{clinic.recruitContact}）
          </p>
        )}

        {/* 応募 or 見学（見学を実施するクリニックのみ） */}
        {hasTour && (
          <div className="grid grid-cols-2 gap-2 mt-8 rounded-full bg-white border border-rc-sand p-1.5" role="tablist" aria-label="応募か見学かを選択">
            {[
              { key: 'apply', label: '応募する' },
              { key: 'tour', label: 'まず見学する' },
            ].map(t => (
              <button
                key={t.key}
                role="tab"
                aria-selected={mode === t.key}
                onClick={() => setMode(t.key)}
                className={`text-[16px] font-bold rounded-full py-2.5 transition-colors ${
                  mode === t.key ? 'bg-rc-teal text-white' : 'text-rc-ink-soft hover:text-rc-teal'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
          <div>
            <label htmlFor="name" className="block text-[15px] font-bold mb-1.5">
              お名前 <span className="text-rc-apricot">必須</span>
            </label>
            <input id="name" value={form.name} onChange={set('name')} className={inputClass('name')} placeholder="山田 花子" autoComplete="name" />
            {errors.name && <p className="text-[14px] text-rc-apricot mt-1.5" role="alert">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="contact" className="block text-[15px] font-bold mb-1.5">
              電話番号 または メールアドレス <span className="text-rc-apricot">必須</span>
            </label>
            <input id="contact" value={form.contact} onChange={set('contact')} className={inputClass('contact')} placeholder="090-1234-5678 / hanako@example.com" autoComplete="tel email" />
            {errors.contact && <p className="text-[14px] text-rc-apricot mt-1.5" role="alert">{errors.contact}</p>}
          </div>

          <div>
            <label htmlFor="job" className="block text-[15px] font-bold mb-1.5">
              希望職種 <span className="text-rc-apricot">必須</span>
            </label>
            <select id="job" value={form.job} onChange={set('job')} className={inputClass('job')}>
              <option value="">選択してください</option>
              {jobs.map(j => <option key={j.slug} value={j.slug}>{j.title}</option>)}
              <option value="undecided">迷っている（相談したい）</option>
            </select>
            {errors.job && <p className="text-[14px] text-rc-apricot mt-1.5" role="alert">{errors.job}</p>}
          </div>

          <div>
            <span className="block text-[15px] font-bold mb-1.5">
              連絡のつきやすい時間帯 <span className="text-rc-apricot">必須</span>
            </span>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="連絡のつきやすい時間帯">
              {['午前（9-12時）', '午後（13-17時）', '夕方以降（17-20時）', 'いつでも'].map(t => (
                <button
                  type="button"
                  key={t}
                  role="radio"
                  aria-checked={form.timeslot === t}
                  onClick={() => setForm(f => ({ ...f, timeslot: t }))}
                  className={`text-[15px] font-medium rounded-full px-4 py-2 border transition-colors ${
                    form.timeslot === t
                      ? 'bg-rc-teal text-white border-rc-teal'
                      : 'bg-white text-rc-ink-soft border-rc-sand hover:border-rc-teal hover:text-rc-teal'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            {errors.timeslot && <p className="text-[14px] text-rc-apricot mt-1.5" role="alert">{errors.timeslot}</p>}
          </div>

          <div>
            <label htmlFor="note" className="block text-[15px] font-bold mb-1.5">
              備考 <span className="text-rc-ink-soft font-normal">任意（質問・希望シフトなど）</span>
            </label>
            <textarea id="note" value={form.note} onChange={set('note')} rows={3} className={inputClass('note')} placeholder="例：週3日・午前のみの勤務を希望しています" />
          </div>

          <button type="submit"
            className="w-full bg-rc-teal text-white font-bold text-[17px] rounded-full py-4 hover:bg-rc-teal-dark transition-colors shadow-md shadow-rc-teal/25">
            {mode === 'tour' ? '見学を予約する' : 'この内容で応募する'}
          </button>
          <p className="text-[13px] text-rc-ink-soft text-center">
            送信後、2営業日以内にご連絡します。ご入力いただいた情報は採用選考の目的にのみ使用します。
          </p>
        </form>

        <div className="mt-10 rounded-xl bg-rc-teal-soft border border-rc-teal/30 p-5 text-center">
          <p className="text-[15px] text-rc-ink">フォームより先に聞きたいことがある方は</p>
          <button onClick={() => openChat()} className="mt-2 inline-flex items-center gap-1.5 text-[16px] font-bold text-rc-teal underline underline-offset-4 decoration-rc-teal/40 hover:decoration-rc-teal">
            <ChatIcon className="w-4 h-4" /> 匿名チャットで相談する
          </button>
        </div>
      </section>
    </RecruitLayout>
  );
}
