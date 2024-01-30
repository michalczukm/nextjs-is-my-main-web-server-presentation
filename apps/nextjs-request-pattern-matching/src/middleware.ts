import { NextResponse, NextRequest, NextMiddleware } from 'next/server';
import * as jose from 'jose'
import { configuration } from './configuration';

export const config = {
  matcher: [
    '/api/((?!health|greet|token|$).*)',
  ],
};

const isAuthorized = async (req: NextRequest) => {
  const token = req.headers.get('authorization')?.replace('Bearer ', '') ?? '';
  const secret = new TextEncoder().encode(configuration.authSecret);

  try {
    await jose.jwtVerify(token, secret, {
      issuer: 'org:michalczukm:issuer',
      audience: 'org:michalczukm:audience',
    })

    return true
  } catch {
    return false
  }
};

export const middleware: NextMiddleware = async (req: NextRequest) => {
  const headers = new Headers(req.headers);
  headers.set('x-michalczukm', new Date().toUTCString());

  const authorized = await isAuthorized(req);

  if (!authorized) {
    return NextResponse.json({ message: "Unauthorized" }, {
      status: 401,
      headers: headers,
    });
  }

  return NextResponse.next({
    headers: headers,
  });
};
