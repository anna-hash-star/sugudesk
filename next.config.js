/** @type {import('next').NextConfig} */

// RECRUIT_DEPLOY=1 のとき（採用サイト専用デプロイ）だけ、静的アセットの参照を
// /recruit 配下へ寄せる。www.sugudesk.com/recruit/:path* のリライト1本で
// ページも _next も画像も配信できるようにするため。
// 通常の開発・本体（dashboard等）のデプロイには影響しない。
// あわせて採用デプロイでは env に NEXT_PUBLIC_ASSET_BASE=/recruit（画像/favicon用）と
// NEXT_PUBLIC_SITE_URL=https://www.sugudesk.com（canonical用）を設定する。
const RECRUIT_DEPLOY = process.env.RECRUIT_DEPLOY === '1';

const nextConfig = RECRUIT_DEPLOY
  ? { assetPrefix: '/recruit' }
  : {};

module.exports = nextConfig;
