import '../styles/globals.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // ページ遷移（別ページへの移動・「トップに戻る」等）のときだけ、CSSの
  // scroll-behavior: smooth を一時的に無効化する。これをしないと、遷移後に
  // Next.js が行う「先頭へスクロール」がアニメーション化して、画面が上に
  // 「ぐーっと」動いてしまう。同一ページ内のアンカー（#stats 等）は
  // hashChange 扱いで routeChangeStart が発火しないため、従来どおりスムーズのまま。
  useEffect(() => {
    const html = document.documentElement;
    const disable = () => { html.style.scrollBehavior = 'auto'; };
    const restore = (url) => {
      // 遷移先ではまず最上部へ即時移動する（Next の先頭スクロールがスムーズ化して
      // 「下から上へぐーっと」動くのを確実に止める）。ハッシュ付きURL（#apply 等）は
      // アンカー位置を尊重したいので即時移動しない。
      const hasHash = typeof url === 'string' && url.includes('#');
      if (!hasHash) window.scrollTo(0, 0);
      // スムーズ設定は次フレームで元に戻す（以降の同一ページ内アンカーはスムーズのまま）
      window.requestAnimationFrame(() => { html.style.scrollBehavior = ''; });
    };
    router.events.on('routeChangeStart', disable);
    router.events.on('routeChangeComplete', restore);
    router.events.on('routeChangeError', restore);
    return () => {
      router.events.off('routeChangeStart', disable);
      router.events.off('routeChangeComplete', restore);
      router.events.off('routeChangeError', restore);
    };
  }, [router.events]);

  return (
    <>
      {/* 既定のファビコン（SuguDesk本体）。採用サイトは RecruitLayout が同じ key="favicon" で
          SVG に上書きする（next/head は同一 key の最後の1つを採用するため確実に差し替わる）。 */}
      <Head>
        <link rel="icon" type="image/png" href="/favicon.png" key="favicon" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
