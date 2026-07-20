import { NextResponse } from 'next/server';

export function middleware(request) {
  const host = request.headers.get('host') || '';
  const { pathname } = request.nextUrl;

  // recruit.sugudesk.com → 採用サイト専用サブドメイン。
  // /recruit 配下と必要な静的アセットだけ公開し、SuguDesk本体（/api・/[client]・/chat 等）は遮断する。
  // ※サブドメイン名を変える場合はこの 'recruit.' を変更（例: 'adeb.' / 'saiyo.'）。
  if (host.startsWith('recruit.')) {
    const allow =
      pathname.startsWith('/recruit') ||
      pathname.startsWith('/recruit-photos') ||
      pathname.startsWith('/_next') ||
      pathname === '/favicon.png' ||
      pathname === '/robots.txt' ||
      pathname === '/sitemap.xml';
    if (allow) return NextResponse.next();

    // ルートは採用トップへ内部リライト（URLは recruit.sugudesk.com/ のまま）
    if (pathname === '/') {
      const url = request.nextUrl.clone();
      url.pathname = '/recruit';
      return NextResponse.rewrite(url);
    }
    // それ以外はこのサブドメインからは見せない
    return new NextResponse('Not Found', { status: 404 });
  }

  // chat.sugudesk.com/:id → /chat/:id にリライト
  if (host.includes('chat.sugudesk.com') || host.startsWith('chat.')) {
    // ルート → 404回避
    if (pathname === '/') {
      return new NextResponse('Not Found', { status: 404 });
    }

    // chat.sugudesk.com/luna-ladies → /chat/luna-ladies にリライト
    const url = request.nextUrl.clone();
    url.pathname = `/chat${pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.png|booster).*)'],
};
