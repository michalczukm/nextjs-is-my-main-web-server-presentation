import type {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
  HookHandlerDoneFunction,
} from 'fastify';
import { createPost, getPost, getPosts } from './data/posts';
import type { Post } from './types';
import { TextEncoder } from 'node:util';
import { configuration } from './configuration';
import * as jose from 'jose';

const isAuthorized = async (req: FastifyRequest) => {
  const token = req.headers['authorization']?.replace('Bearer ', '') ?? '';
  const secret = new TextEncoder().encode(configuration.authSecret);

  try {
    await jose.jwtVerify(token, secret, {
      issuer: 'org:michalczukm:issuer',
      audience: 'org:michalczukm:audience',
    });

    return true;
  } catch {
    return false;
  }
};

const xHeaderMiddleware = (
  _request: FastifyRequest,
  reply: FastifyReply,
  done: HookHandlerDoneFunction
) => {
  reply.header('x-michalczukm', new Date().toUTCString());
  done();
};

const authMiddleware = async (request: FastifyRequest, reply: FastifyReply) => {
  const authorized = await isAuthorized(request);

  if (!authorized) {
    reply.code(401).send({ message: 'Unauthorized' });
  }
};

export const openRoutes: FastifyPluginAsync = async (
  fastify: FastifyInstance
) => {
  fastify.get('/greet', async () => ({
    greeting: '👋',
  }));

  fastify.get('/health', async () => ({
    status: 'ok',
    timestamp: Date.now(),
  }));
};

export const authRoutes: FastifyPluginAsync = async (
  fastify: FastifyInstance
) => {
  fastify.addHook('preHandler', xHeaderMiddleware);
  fastify.addHook('preHandler', authMiddleware);

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

export default authRoutes;
