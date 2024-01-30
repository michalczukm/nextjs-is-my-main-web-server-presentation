import { getComment } from '@mm/data/comments';
import { getPost } from '@mm/data/posts';
import { NextRequest, NextResponse } from 'next/server';
import { createEdgeRouter } from 'next-connect';

interface RequestContext {
  params: {
    postId: string;
    commentId: string;
  };
}

const router = createEdgeRouter<NextRequest, RequestContext>();

router.get(async (_request, context) => {
  const postId = +context.params.postId;
  const commentId = +context.params.commentId;

  const post = await getPost(postId);
  const comment = await getComment(commentId);

  return post && comment
    ? NextResponse.json({ post, comment })
    : NextResponse.json({ error: 'Data not found' }, { status: 404 });
});

// Waaay not-RESTful endpoint, but let's go with it to demonstrate the nested slugs :D
export async function GET(request: NextRequest, ctx: RequestContext): Promise<Response> {
  return await router.run(request, ctx) as Response;
}
