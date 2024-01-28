import { getComment } from '@mm/data/comments';
import { getPost } from '@mm/data/posts';
import { Post, Comment } from '@mm/types';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs' 

// Waaay not-RESTful endpoint, but let's go with it to demonstrate the nested slugs :D
export async function GET(
  _: NextRequest,
  { params }: { params: { postId: string, commentId: string } }
): Promise<NextResponse<{ post: Post, comment: Comment } | { error: string }>> {
  const postId = +params.postId;
  const commentId = +params.commentId;
  
  const post = await getPost(postId);
  const comment = await getComment(commentId);

  return post && comment
    ? NextResponse.json({ post, comment })
    : NextResponse.json({ error: 'Data not found' }, { status: 404 });
}
