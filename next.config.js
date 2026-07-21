/** @type {import('next').NextConfig} */

// RECRUIT_DEPLOY=1 のとき（採用サイト専用デプロイ）だけ、静的アセットの参照を
// /recruit 配下へ寄せる。www.sugudesk.com/recruit/:path* のリライト1本で
// ページも _next も画像も配信できるようにするため。
// 通常の開発・本体（dashboard等）のデプロイには影響しない。
// あわせて採用デプロイでは env に NEXT_PUBLIC_ASSET_BASE=/recruit（画像/favicon用）と
// NEXT_PUBLIC_SITE_URL=https://www.sugudesk.com（canonical用）を設定する。
const RECRUIT_DEPLOY = process.env.RECRUIT_DEPLOY === '1';

const nextConfig = RECRUIT_DEPLOY
  ? {
      assetPrefix: '/recruit',
      // public 配下（画像・favicon）は assetPrefix の対象外でルート（/recruit-photos/…）で
      // 配信されるため、/recruit/recruit-photos/* を実ファイルへ内部転送する。
      // これで画像・ファビコンも /recruit 配下で解決でき、LP側の /recruit/:path* リライト
      // 1本だけで全部まかなえる。
      async rewrites() {
        return [
          { source: '/recruit/recruit-photos/:path*', destination: '/recruit-photos/:path*' },
        ];
      },
    }
  : {};

module.exports = nextConfig;
