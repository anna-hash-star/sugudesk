import { Html, Head, Main, NextScript } from 'next/document';
import { GA_ID } from '../data/site';

export default function Document() {
  return (
    <Html lang="ja">
      <Head>
        {/* JSが有効なときだけ reveal アニメを効かせる（無効時はコンテンツを常に表示）。
            描画前に html.js を付与してチラつきを防ぐ。 */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js');",
          }}
        />

        {/* Google Analytics 4 */}
        {GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`,
              }}
            />
          </>
        )}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
