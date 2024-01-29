import { NextRequest, NextResponse } from 'next/server';

// This one won't work, there can be only single middleware on root level
// Also - adding one in `route` won't work.
// So it is not "granular", it is way the opposite :D
export function middleware(_: NextRequest, res: NextResponse) {
  const headers = new Headers(res.headers);
  headers.set('x-michalczukm-accounts', new Date().toUTCString());

  return NextResponse.next({
    headers: headers,
  });
}
