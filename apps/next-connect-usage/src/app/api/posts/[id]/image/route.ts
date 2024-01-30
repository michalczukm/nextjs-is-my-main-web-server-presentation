import { createEdgeRouter } from 'next-connect';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

interface RequestContext {
  params: {
    id: string;
  };
}

const router = createEdgeRouter<NextRequest, RequestContext>();

router.get(async (_request, context) => {
  const postId = +context.params.id;

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
});

export async function GET(request: NextRequest, ctx: RequestContext): Promise<Response> {
  return await router.run(request, ctx) as Response;
}