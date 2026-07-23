// ==========================================================================
//  サイト共通データ（ここを編集するだけで各ページに反映されます）
//  ※ CMSを使わずに更新する場合は、このファイルを編集して GitHub に保存すれば
//    Cloudflare Pages が自動でデプロイし、サイトに反映されます。
// ==========================================================================

// 本番ドメイン（SEO・OGPのcanonicalに使用）
export const SITE_URL = 'https://exmore.jp';

// 採用情報の外部リンク（HERP）
export const CAREERS_URL = 'https://herp.careers/v1/exmore12';

// お問い合わせフォームの送信先（Formspree）
export const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mrenajwb';

// -------- ヘッダー / フッターのナビゲーション --------
// type: 'anchor'（トップ内リンク）/ 'page'（別ページ）/ 'external'（外部リンク）
export const NAV = [
  { href: '/#about', label: '私たちについて', type: 'anchor' },
  { href: '/#services', label: '事業内容', type: 'anchor' },
  { href: '/message/', label: '代表メッセージ', type: 'page' },
  { href: '/#news', label: 'ニュース', type: 'anchor' },
  { href: '/#company', label: '会社情報', type: 'anchor' },
  { href: CAREERS_URL, label: '採用情報', type: 'external' },
];

// -------- ニュース / リリース --------
// ニュースは data/news.js に移しました（記事ページ対応・日付順表示のため）。

// -------- 会社概要 --------
export const COMPANY = [
  ['会社名', '株式会社exmore（エクスモア）'],
  ['設立', '2024年12月13日'],
  ['所在地', '東京都渋谷区道玄坂1丁目10番8号 渋谷道玄坂東急ビル 2F-C'],
  ['代表者', '代表取締役 CEO　根来 杏奈'],
  ['資本金等', '約3,100万円（資本準備金を含む）'],
  ['事業内容', '医療DXサービス、教育・研修サービス、その他コンサルティング'],
];
