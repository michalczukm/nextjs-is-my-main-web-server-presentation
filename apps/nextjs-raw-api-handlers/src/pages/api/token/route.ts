import { configuration } from '@mm/configuration';
import * as jose from 'jose'
import { NextResponse } from 'next/server';

export async function POST() {
  const secret = new TextEncoder().encode(configuration.authSecret);
  
  const token = await new jose.SignJWT({})
  .setProtectedHeader({ alg: 'HS512' })
  .setIssuer('org:michalczukm:issuer')
  .setAudience('org:michalczukm:audience')
  .sign(secret);

  return new NextResponse(token)
}
