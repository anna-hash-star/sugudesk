import { useEffect } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/router';

// Google Analytics（GA4）と Google Search Console を採用サイトに埋め込む。
// どちらも環境変数で有効化する（値が無ければ何も出力しない＝開発・プレビューは素のまま）。
//
//   NEXT_PUBLIC_GA_ID           … GA4 の測定ID（例: G-XXXXXXXXXX）
//   NEXT_PUBLIC_GSC_VERIFICATION … Search Console「HTMLタグ」認証の content 値
//
// 採用サイトは Next.js の SPA 遷移（/recruit/adeb → /recruit/adeb/entry 等）で
// ページが再読み込みされないため、gtag は初期表示ぶんしか自動計測しない。
// そこで router のイベントで遷移ごとに page_view を手動送信する。
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';
export const GSC_VERIFICATION = process.env.NEXT_PUBLIC_GSC_VERIFICATION || '';

export default function RecruitAnalytics() {
  const router = useRouter();

  // SPA 遷移ごとに page_view を送る（初回表示は gtag config が自動送信するので二重にしない）。
  useEffect(() => {
    if (!GA_ID) return;
    const handleRouteChange = (url) => {
      if (typeof window.gtag !== 'function') return;
      window.gtag('config', GA_ID, { page_path: url });
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router.events]);

  if (!GA_ID) return null;

  return (
    <>
      {/* gtag.js 本体。afterInteractive で本文の描画をブロックしない。 */}
      <Script
        id="ga-lib"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
