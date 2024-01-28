import { getComment } from '@mm/data/comments';
import { Comment } from '@mm/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<Comment | { error: string }>> {
  const id = +params.id;
  const comment = await getComment(id);

  return comment
    ? NextResponse.json(comment)
    : NextResponse.json({ error: 'Comment not found' }, { status: 404 });
}
