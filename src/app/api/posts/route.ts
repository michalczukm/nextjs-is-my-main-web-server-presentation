import { createPost, getPosts } from '@mm/data/posts';
import { Post } from '@mm/types';
import { NextRequest, NextResponse } from 'next/server';

const getSearchParams = <T>(
  request: NextRequest
): ((name: keyof T & string) => string | undefined) => {
  const params = request.nextUrl.searchParams;
  return (name) => params.get(name) || undefined;
};

/**
 * 
 * @swagger
 * /api/posts:
 *   get:
 *     summary: 'Retrieve posts'
 *     description: 'This endpoint retrieves posts. You can filter the posts by title, author, and tags.'
 *     parameters:
 *       - name: 'title'
 *         in: 'query'
 *         description: 'Title of the post'
 *         required: false
 *         type: 'string'
 *       - name: 'author'
 *         in: 'query'
 *         description: 'Author of the post'
 *         required: false
 *         type: 'string'
 *       - name: 'tags'
 *         in: 'query'
 *         description: 'Comma-separated list of tags associated with the post'
 *         required: false
 *         type: 'string'
 *     responses:
 *       '200':
 *         description: 'Successful operation'
 *         schema:
 *           type: 'array'
 *           items:
 *             $ref: '#/definitions/Post'
 * definitions:
 *   Post:
 *     type: 'object'
 *     properties:
 *       title:
 *         type: 'string'
 *       author:
 *         type: 'string'
 *       tags:
 *         type: 'array'
 *         items:
 *           type: 'string'
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<readonly Post[]>> {
  const get = getSearchParams<Post>(request);

  const filter: Partial<Post> = {
    title: get('title'),
    author: get('author'),
    tags: get('tags')?.split(','),
  };

  return NextResponse.json(await getPosts(filter));
}

/**
 * 
 * @swagger
 * /api/posts:
 *   post:
 *     summary: 'Create a post'
 *     description: 'This endpoint creates a post.'
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Post'
 *     responses:
 *       '201':
 *         description: 'Successful operation'
 *         schema:
 *           $ref: '#/definitions/Post'
 * definitions:
 *   Post:
 *     type: 'object'
 *     properties:
 *       title:
 *         type: 'string'
 * /definitions/Post:
 *  type: 'object'
 *  properties:
 *    title:
 *      type: 'string'
 *    author:
 *      type: 'string'
 *    tags: 
 *      type: 'array'
 *    items:
 *      type: 'string'
 *  required:
 *    - title
 *    - author
 *    - tags
 *  example:
 *    title: 'Hello World'
 *    author: 'John Doe'
 *    tags:
 *      - 'hello'
 *      - 'world'
 */
export async function POST(request: NextRequest): Promise<NextResponse<Post>> {
  const post = await request.json();
  const newPost = await createPost(post);
  const location = `${request.nextUrl.href}/${newPost.id}`;

  return NextResponse.json(newPost, { status: 201, headers: { location } });
}
