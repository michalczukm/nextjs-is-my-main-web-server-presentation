import { NextResponse, NextRequest, NextMiddleware } from 'next/server';
import jwt from 'jsonwebtoken';
import { configuration } from './configuration';

export const config = {
  matcher: [
    '/api/((?!greet|token|$).*)',
  ],
};

const isAuthorized = (req: NextRequest) => {
  const token = req.headers.get('authorization')?.replace('Bearer ', '') ?? '';

  return new Promise<boolean>((resolve) => {
    jwt.verify(
      token,
      configuration.authSecret,
      { algorithms: ['HS512'] },
      (err, decoded) => {
        resolve(!!decoded && !err);
      }
    );
  });
};

/**
 * This is interesting one!
 * You won't be able to run it, since middleware **always** runs on edge.
 * By that I mean - always run on V8 isolated instance, and not in node runtime.
 * 
 * You can try change runtime - but it won't have any effect.
 * 
 * Any why it won't work in this case?
 * >  ⨯ Error: The edge runtime does not support Node.js 'crypto' module.
 * Indeed. https://www.npmjs.com/package/jsonwebtoken uses crypto.
 */
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
