import '../styles/globals.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

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
    const restore = () => {
      // Next の先頭スクロールが済んでから元に戻す（次フレームで復帰）
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

  return <Component {...pageProps} />;
}
