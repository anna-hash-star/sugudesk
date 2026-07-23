import Head from 'next/head';
import { SITE_URL } from '../data/site';

/**
 * 各ページの <head>（title / description / canonical / OGP / Twitter / 構造化データ）
 * をまとめて出力するSEOコンポーネント。
 */
export default function Seo({ title, description, path = '/', type = 'website', jsonLd }) {
  const url = SITE_URL + path;
  const ogImage = SITE_URL + '/ogp.png';

  // 組織情報の構造化データ（Google が会社情報を理解しやすくする）
  const orgLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '株式会社exmore',
    alternateName: ['エクスモア', '株式会社エクスモア', 'exmore'],
    url: SITE_URL,
    logo: SITE_URL + '/ogp.png',
    description,
    foundingDate: '2024-12-13',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'JP',
      addressRegion: '東京都',
      addressLocality: '渋谷区',
      streetAddress: '道玄坂1丁目10番8号 渋谷道玄坂東急ビル 2F-C',
    },
    founder: { '@type': 'Person', name: '根来 杏奈', jobTitle: '代表取締役 CEO' },
  };

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="エクスモア,株式会社エクスモア,exmore,株式会社exmore,医療DX,ヘルスケア,SuguDesk,採用代行,業務代行" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={url} />
      <link rel="icon" href="/favicon.svg" />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="株式会社exmore" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="ja_JP" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* 構造化データ */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
    </Head>
  );
}
