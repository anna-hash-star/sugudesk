import '../styles/globals.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { GA_ID } from '../data/site';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // ページ遷移（クライアント側ナビ）ごとに GA4 のページビューを送信
  useEffect(() => {
    if (!GA_ID) return;
    const onRouteChange = (url) => {
      if (window.gtag) window.gtag('config', GA_ID, { page_path: url });
    };
    router.events.on('routeChangeComplete', onRouteChange);
    return () => router.events.off('routeChangeComplete', onRouteChange);
  }, [router.events]);

  return <Component {...pageProps} />;
}
