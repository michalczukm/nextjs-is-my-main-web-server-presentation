import { NextResponse } from 'next/server';

export async function GET() {
    /**
     * Check if you have:
     * * connection to database
     * * connection to external services
     * * connection to anything else which is critical for your app
     * * env vars set etc.
     */
  return NextResponse.json({ status: 'ok', timestamp: Date.now() });
}
