import { createPost, getPosts } from '@mm/data/posts';
import { Post } from '@mm/types';
import { NextApiRequest, NextApiResponse } from 'next';

const getSearchParams = <T>(
  request: NextApiRequest
): ((name: keyof T & string) => string | undefined) => {
  return (name) => {
    const param = request.query?.[name];
    if (Array.isArray(param)) {
      return param[0];
    }
    return param;
  };
};

const GET = async (request: NextApiRequest, response: NextApiResponse) => {
  const get = getSearchParams<Post>(request);

  const filter: Partial<Post> = {
    title: get('title'),
    author: get('author'),
    tags: get('tags')?.split(','),
  };

  return response.json(await getPosts(filter));
}

const POST = async (request: NextApiRequest, response: NextApiResponse) => {
  const post = await request.body;
  const newPost = await createPost(post);
  const location = `${request.url}/${newPost.id}`;

  response.setHeader('location', location);
  return response.status(201).json(newPost);
}


export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if(request.method === 'GET') {
    return GET(request, response);
  }
  if(request.method === 'POST') {
    return POST(request, response);
  }

  return response.status(405).end();
}