import { createPost, getPosts } from '@mm/data/posts';
import { Post } from '@mm/types';
import { NextRequest, NextResponse } from 'next/server';
import { createEdgeRouter } from 'next-connect';

const router = createEdgeRouter<NextRequest, {}>();

const getSearchParams = <T>(
  request: NextRequest
): ((name: keyof T & string) => string | undefined) => {
  const params = request.nextUrl.searchParams;
  return (name) => params.get(name) || undefined;
};

router
  .get(async (request) => {
    const get = getSearchParams<Post>(request);

    const filter: Partial<Post> = {
      title: get('title'),
      author: get('author'),
      tags: get('tags')?.split(','),
    };

    return NextResponse.json(await getPosts(filter));
  })
  .post(async (request) => {
    const post = await request.json();
    const newPost = await createPost(post);
    const location = `${request.nextUrl.href}/${newPost.id}`;

    return NextResponse.json(newPost, { status: 201, headers: { location } });
  });

export async function GET(request: NextRequest): Promise<Response> {
  return (await router.run(request, {})) as Response;
}
export async function POST(request: NextRequest): Promise<Response> {
  return (await router.run(request, {})) as Response;
}
