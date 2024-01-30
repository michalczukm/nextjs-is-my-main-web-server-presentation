import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { createPost, getPost, getPosts, updatePost } from './data/posts';
import type { Post } from './types';
import { z } from 'zod';

const putPostSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  author: z.string(),
  tags: z.array(z.string()),
});

export const routes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get('/greet', async () => ({
    greeting: '👋',
  }));

  fastify.get('/health', async () => ({
    status: 'ok',
    timestamp: Date.now(),
  }));

  fastify.get<{ Querystring: Partial<Post>; Reply: readonly Post[] }>(
    '/posts',
    async (request) => {
      const filter = request.query;
      return getPosts(filter);
    }
  );

  fastify.post<{ Body: Omit<Post, 'id'>; Reply: Post }>(
    '/posts',
    async (request, reply) => {
      const post = request.body;
      const newPost = await createPost(post);
      const location = `${request.url}/${newPost.id}`;

      reply.header('location', location);
      reply.code(201).send(newPost);
    }
  );

  fastify.get<{ Params: { id: Post['id'] }; Reply: Post | { error: string } }>(
    '/posts/:id',
    async (request, reply) => {
      const { id } = request.params;
      const post = await getPost(id);

      return post
        ? reply.send(post)
        : reply.code(404).send({ error: 'Post not found' });
    }
  );
};

export default routes;
