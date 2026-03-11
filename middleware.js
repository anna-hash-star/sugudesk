import { NextResponse } from 'next/server';

export function middleware(request) {
  const host = request.headers.get('host') || '';
  const { pathname } = request.nextUrl;

  // chat.sugudesk.com/:id → /chat/:id にリライト
  if (host.startsWith('chat.')) {
    // ルート → 404回避（将来的にクリニック選択ページ等も可）
    if (pathname === '/') {
      return new NextResponse('Not Found', { status: 404 });
    }

    // _next, api, favicon 等はそのまま通す
    if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.startsWith('/favicon')) {
      return NextResponse.next();
    }

    // chat.sugudesk.com/luna-ladies → /chat/luna-ladies にリライト
    const url = request.nextUrl.clone();
    url.pathname = `/chat${pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
