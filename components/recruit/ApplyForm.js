import { clinic } from '../../lib/recruit/site-data';

// Googleフォームの埋め込み。clinic.applyFormUrl が設定されているときだけ表示する。
// URL に embedded=true が無ければ自動で付与する。
// 注意：Googleフォームに「ファイルのアップロード」質問があると、埋め込みは全問表示されず
// タイトル＋「フォームに記入する」ボタンだけの折りたたみ表示になる（Google仕様・ログインを挟むため）。
// その場合 height は小さめ（既定520）でよい。アップロード質問が無ければ全問表示されるので大きめに。
export default function ApplyForm({ height = 520 }) {
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
