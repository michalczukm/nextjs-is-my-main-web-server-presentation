import { getPosts } from '@mm/data/posts';
import { Post } from '@mm/types';
import { NextRequest, NextResponse } from 'next/server';

const getSearchParams = <T>(request: NextRequest): (name: keyof T & string) => string | undefined => {
  const params = request.nextUrl.searchParams;
  return (name) => params.get(name) || undefined;
}

export async function GET(request: NextRequest): Promise<NextResponse<readonly Post[]>> {
  const get = getSearchParams<Post>(request);

  const filter: Partial<Post> = {
    title: get('title'),
    author: get('author'),
    tags: get('tags')?.split(','),
  }
  
  return NextResponse.json((await getPosts(filter)));
}
