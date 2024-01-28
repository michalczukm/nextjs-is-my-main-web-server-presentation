import { getPost } from '@mm/data/posts';
import { Post } from '@mm/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _: NextRequest,
  context: { params: { id: string } }
): Promise<NextResponse<Post | { error: string }>> {
  const id = +context.params.id;
  const post = await getPost(id);

  return post
    ? NextResponse.json(post)
    : NextResponse.json({ error: 'Post not found' }, { status: 404 });
}
