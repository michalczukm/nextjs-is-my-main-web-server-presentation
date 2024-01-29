import { getPost, updatePost } from '@mm/data/posts';
import { Post } from '@mm/types';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<Post | { error: string }>> {
  const id = +params.id;
  const post = await getPost(id);

  return post
    ? NextResponse.json(post)
    : NextResponse.json({ error: 'Post not found' }, { status: 404 });
}

const putPostSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  author: z.string(),
  tags: z.array(z.string()),
});

// let's use ZOD to validate the incoming data
// PS we have few good candidates for the proper middleware here
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<Post | { error: object | string }>> {
  if(headers().get('content-type') !== 'application/json') {
    return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
  }

  const id = +params.id;
  const parseResult = await putPostSchema.safeParseAsync(await request.json());

  if (!parseResult.success) {
    const error = parseResult.error;
    return NextResponse.json({ error }, { status: 400 });
  }

  const updated = await updatePost(id, parseResult.data);
  if (!updated) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  const location = `${request.nextUrl.href}/${updated.id}`;
  return NextResponse.json(updated, { status: 200, headers: { location } });
}
