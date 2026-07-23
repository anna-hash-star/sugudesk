// ==========================================================================
//  サイト共通データ（ここを編集するだけで各ページに反映されます）
//  ※ CMSを使わずに更新する場合は、このファイルを編集して GitHub に保存すれば
//    Cloudflare Pages が自動でデプロイし、サイトに反映されます。
// ==========================================================================

// 本番ドメイン（SEO・OGPのcanonicalに使用）
export const SITE_URL = 'https://exmore.jp';

// 採用情報の外部リンク（HERP）
export const CAREERS_URL = 'https://herp.careers/v1/exmore12';

// -------- ヘッダー / フッターのナビゲーション --------
// type: 'anchor'（トップ内リンク）/ 'page'（別ページ）/ 'external'（外部リンク）
export const NAV = [
  { href: '/#about', label: '私たちについて', type: 'anchor' },
  { href: '/#services', label: '事業内容', type: 'anchor' },
  { href: '/message', label: '代表メッセージ', type: 'page' },
  { href: '/#news', label: 'ニュース', type: 'anchor' },
  { href: '/#company', label: '会社情報', type: 'anchor' },
  { href: CAREERS_URL, label: '採用情報', type: 'external' },
];

// -------- ニュース / リリース --------
// 新しいお知らせは、この配列の先頭にオブジェクトを1つ足すだけでOKです。
//   { date: '2026.08.01', cat: 'お知らせ', title: '見出し', href: 'リンク先URL' }
// cat（カテゴリ）例： 'お知らせ' / 'リリース' / '導入事例' / '受賞' / 'メディア掲載'
export const NEWS = [
  {
    date: '2026.07.07',
    cat: 'お知らせ',
    title: 'シードラウンドにて資金調達を実施しました',
    href: 'https://prtimes.jp/main/html/rd/p/000000005.000157081.html',
  },
  {
    date: '2026.05.23',
    cat: '導入事例',
    title: '【エバラ食品さま】多様な社員に寄り添う、オーダーメイド型のヘルスケア研修を導入',
    href: '#news',
  },
  {
    date: '2025.11.03',
    cat: '受賞',
    title: '「病院経営イノベーションピッチ」にてPoC賞を受賞しました',
    href: '#news',
  },
];

// -------- 会社概要 --------
export const COMPANY = [
  ['会社名', '株式会社exmore'],
  ['設立', '2024年12月13日'],
  ['所在地', '東京都渋谷区道玄坂1丁目10番8号 渋谷道玄坂東急ビル 2F-C'],
  ['代表者', '代表取締役 CEO　根来 杏奈'],
  ['資本金等', '約3,100万円（資本準備金を含む）'],
  ['事業内容', '医療DXサービス、教育・研修サービス、その他コンサルティング'],
];
