import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/greet:
 *   get:
 *     description: Returns the hello world
 *     responses:
 *       200:
 *         description: Hello World!
 */
export async function GET() {
  return NextResponse.json({ greeting: '👋' });
}
