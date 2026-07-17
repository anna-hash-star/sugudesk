import { clinic } from '../../lib/recruit/site-data';

// Googleフォームの埋め込み。clinic.applyFormUrl が設定されているときだけ表示する。
// URL に embedded=true が無ければ自動で付与する。
export default function ApplyForm({ height = 1200 }) {
  const url = clinic.applyFormUrl;
  if (!url) return null;
  const src = url.includes('embedded=true')
    ? url
    : url + (url.includes('?') ? '&' : '?') + 'embedded=true';
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
        フォームがうまく表示されない場合は、
        <a href={url} target="_blank" rel="noopener noreferrer" className="font-bold text-rc-teal underline underline-offset-2">別タブで応募フォームを開く</a>
        こともできます。
      </p>
    </div>
  );
}
