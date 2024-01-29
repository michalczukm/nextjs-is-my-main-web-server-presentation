import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const postId = +params.id;

  const postImage = await fs.open(
    path.join(process.cwd(), `src/data/images/posts/${postId}.png`),
    'r'
  );
  const size = (await postImage.stat()).size;

  const stream = postImage.createReadStream({
    autoClose: true,
  });

  // This is interesting - old `pages` NextApiResponse type handled Node.js streams
  return new NextResponse(stream as unknown as ReadableStream, {
    headers: {
      'Content-Type': 'image/png',
      'Content-Length': size.toString(),
      'Content-Disposition': 'inline',
    },
  });
}
