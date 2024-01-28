import { NextResponse, NextRequest } from 'next/server';

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

export function middleware(_: NextRequest, res: NextResponse) {
  // Add a header to all requests
  const headers = new Headers(res.headers);
  headers.set('x-michalczukm', new Date().toUTCString());

  return NextResponse.next({
    headers: headers,
  });
}
