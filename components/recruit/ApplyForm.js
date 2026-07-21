import { useClinic } from '../../lib/recruit/clinic-context';
import RecruitApplyForm from './RecruitApplyForm';

// 応募フォームの表示。
// - clinic.applyFormUrl が無ければ何も出さない（従来の簡易フォームにフォールバック）。
// - clinic.applyFormInline === true：iframeでページ内に埋め込む（iframe埋め込みを許可し、
//   ファイルアップロード質問の無いフォーム向け＝Googleフォーム/Tally等）。
// - 既定：別タブで開く「応募フォームを開く」ボタン。formrun のように iframe直埋めを拒否する
//   フォームや、ファイル添付でログインを挟むフォームでも確実に動く。
export default function ApplyForm({ height = 1400 }) {
  const { clinic } = useClinic();
  // 自作の応募フォーム（履歴書アップロード付き・Apps Script送信）を最優先で使う
  if (clinic.applyForm) return <RecruitApplyForm />;

  const url = clinic.applyFormUrl;
  if (!url) return null;

  if (clinic.applyFormInline) {
    const isGoogle = /docs\.google\.com\/forms/i.test(url);
    const src = (isGoogle && !url.includes('embedded=true'))
      ? url + (url.includes('?') ? '&' : '?') + 'embedded=true'
      : url;
    return (
      <div>
        <div className="rounded-2xl border border-rc-sand bg-white overflow-hidden">
          <iframe
            src={src}
            title="応募フォーム"
            loading="lazy"
            className="w-full block"
            style={{ height, border: 0 }}
          >
            読み込んでいます…
          </iframe>
        </div>
        <p className="text-[13px] text-rc-ink-soft mt-3 text-center">
          うまく表示されない場合は
          <a href={url} target="_blank" rel="noopener noreferrer" className="font-bold text-rc-teal underline underline-offset-2">別タブで開く</a>
          こともできます。
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-rc-sand bg-rc-ivory px-6 py-8 md:py-10 text-center">
      <p className="text-[16px] text-rc-ink leading-7">
        応募フォームからご応募ください。<br className="hidden sm:block" />
        履歴書・職務経歴書もフォームから添付できます。
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 mt-5 bg-rc-teal text-white font-bold text-[17px] rounded-full px-8 py-3.5 hover:bg-rc-teal-dark transition-colors shadow-md shadow-rc-teal/25"
      >
        応募フォームを開く
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
      </a>
      <p className="text-[13px] text-rc-ink-soft mt-3">別タブで応募フォームが開きます（ログイン不要・履歴書などの添付もできます）。</p>
    </div>
  );
}
