import { clinic } from '../../lib/recruit/site-data';

// Googleフォームの埋め込み。clinic.applyFormUrl が設定されているときだけ表示する。
// URL に embedded=true が無ければ自動で付与する。
export default function ApplyForm({ height = 1400 }) {
  const url = clinic.applyFormUrl;
  if (!url) return null;
  const src = url.includes('embedded=true')
    ? url
    : url + (url.includes('?') ? '&' : '?') + 'embedded=true';
  return (
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
  );
}
