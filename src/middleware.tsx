import { NextResponse, NextRequest, NextMiddleware } from 'next/server';

// Stop Middleware running on static files and public folder
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next
     * - static (static files)
     * - favicon.ico (favicon file)
     * - public folder
     * - public folder
     */
    // '/((?!static|.*\\..*|_next|favicon.ico).*)',
    '/api/:path*',
  ],
};

export const middleware: NextMiddleware = (req: NextRequest) => {
  const headers = new Headers(req.headers);
  headers.set('x-michalczukm', new Date().toUTCString());

  return NextResponse.next({
    headers: headers,
  });
}
