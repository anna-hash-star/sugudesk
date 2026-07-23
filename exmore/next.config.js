/** @type {import('next').NextConfig} */
// Cloudflare Pages 向けの「静的書き出し」設定。
// next build で out/ に純粋な HTML/CSS/JS が生成され、サーバー不要で無料公開できる。
const nextConfig = {
  output: 'export',            // 静的サイトとして書き出す
  images: { unoptimized: true }, // 画像最適化サーバーを使わない（静的化に必須）
  trailingSlash: true,        // /about/ の形。静的ホスティングと相性が良い
};

module.exports = nextConfig;
