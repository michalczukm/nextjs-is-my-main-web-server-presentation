import { getComments } from '@mm/data/comments';
import { Comment } from '@mm/types';
import { NextRequest, NextResponse } from 'next/server';

const getSearchParams = <T>(request: NextRequest): (name: keyof T & string) => string | undefined => {
  const params = request.nextUrl.searchParams;
  return (name) => params.get(name) || undefined;
}

export async function GET(request: NextRequest): Promise<NextResponse<readonly Comment[]>> {
  const get = getSearchParams<Comment>(request);
  const postId = get('postId')

  const filter: Partial<Comment> = {
    author: get('author'),
    postId: postId ? +postId : undefined,
  }
  
  return NextResponse.json((await getComments(filter)));
}
