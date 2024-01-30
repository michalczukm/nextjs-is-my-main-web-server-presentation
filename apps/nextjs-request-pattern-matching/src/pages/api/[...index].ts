import { createPost, getPost, getPosts, updatePost } from '@mm/data/posts';
import { Post } from '@mm/types';
import type { NextApiRequest, NextApiResponse } from 'next';
import { match, P } from 'ts-pattern';
import { z } from 'zod';
import fs from 'node:fs/promises';
import path from 'node:path';
import { configuration } from '@mm/configuration';
import * as jose from 'jose';

const putPostSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  author: z.string(),
  tags: z.array(z.string()),
});

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

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { index: _, ...queryParams } = request.query;

  return match(request)
    .with(
      {
        method: 'GET',
        query: {
          index: ['greet'],
        },
      },
      async () => response.json({ greeting: '👋' })
    )
    .with(
      {
        method: 'GET',
        query: {
          index: ['health'],
        },
      },
      async () => response.json({ status: 'ok', timestamp: Date.now() })
    )
    .with(
      {
        method: 'GET',
        query: {
          index: ['posts'],
          title: P.optional(P.string),
          author: P.optional(P.string),
          tags: P.optional(P.string),
        },
      },
      async () => {
        const get = getSearchParams<Post>(request);

        const filter: Partial<Post> = {
          title: get('title'),
          author: get('author'),
          tags: get('tags')?.split(','),
        };

        return response.json(await getPosts(filter));
      }
    )
    .with(
      {
        method: 'POST',
        query: {
          index: ['posts'],
        },
      },
      async () => {
        const post = request.body;
        const newPost = await createPost(post);
        const location = `${request.url}/${newPost.id}`;

        response.setHeader('location', location);
        return response.status(201).json(newPost);
      }
    )
    .with(
      {
        method: 'GET',
        query: {
          index: ['posts', P.select('id', P.string)],
        },
      },
      async ({ id }) => {
        const post = await getPost(+id);

        return post
          ? response.json(post)
          : response.status(404).json({ error: 'Post not found' });
      }
    )
    .with(
      {
        method: 'PUT',
        query: {
          index: ['posts', P.select('id', P.string)],
        },
        headers: {
          'content-type': 'application/json',
        },
      },
      async ({ id }) => {
        const result = await putPostSchema.safeParseAsync(request.body);
        if (!result.success) {
          return response.status(400).json({ error: result.error });
        }

        const updated = await updatePost(+id, result.data);
        if (!updated) {
          return response.status(404).json({ error: 'Post not found' });
        }

        const location = `${request.url}/${updated.id}`;
        response.setHeader('location', location);
        return response.status(200).json(updated);
      }
    )
    .with(
      {
        method: 'GET',
        query: {
          index: ['posts', P.select('id', P.string), 'image'],
        },
      },
      async ({ id }) => {
        const postImage = await fs.open(
          path.join(process.cwd(), `src/data/images/posts/${id}.png`),
          'r'
        );
        const size = (await postImage.stat()).size;

        const stream = postImage.createReadStream({
          autoClose: true,
        });

        response
          .setHeader('content-type', 'image/png')
          .setHeader('content-length', size.toString())
          .setHeader('content-disposition', 'inline');

        stream.pipe(response);
      }
    )
    .with(
      {
        method: 'POST',
        query: {
          index: ['token'],
        },
      },
      async () => {
        const secret = new TextEncoder().encode(configuration.authSecret);

        const token = await new jose.SignJWT({})
          .setProtectedHeader({ alg: 'HS512' })
          .setIssuer('org:michalczukm:issuer')
          .setAudience('org:michalczukm:audience')
          .sign(secret);

        return response.send(token);
      }
    )
    .otherwise(() => response.status(404).json({ error: 'Not found' }));
}
