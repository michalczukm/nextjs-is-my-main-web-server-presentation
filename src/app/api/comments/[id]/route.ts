import { getComment } from '@mm/data/comments';
import { Comment } from '@mm/types';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge'

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<Comment | { error: string }>> {
  const id = +params.id;
  const comment = await getComment(id);

  return comment
    ? NextResponse.json(comment, { 
      headers: { 
        // cache for looooong
        'Cache-Control': 's-maxage=31536000, stale-while-revalidate',
        'X-Comment-endpoint-timestamp': new Date().toUTCString(),
      } 
    })
    : NextResponse.json({ error: 'Comment not found' }, { status: 404 });
}
