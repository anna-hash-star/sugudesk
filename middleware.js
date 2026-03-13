import { NextResponse } from 'next/server';

export function middleware(request) {
  const host = request.headers.get('host') || '';
  const { pathname } = request.nextUrl;

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
  matcher: ['/((?!_next/static|_next/image|favicon\\.png).*)'],
};
