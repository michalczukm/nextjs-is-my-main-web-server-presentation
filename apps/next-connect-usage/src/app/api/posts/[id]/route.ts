import { getPost, updatePost } from '@mm/data/posts';
import { NextRequest, NextResponse } from 'next/server';
import { NextHandler, createEdgeRouter } from 'next-connect';
import { ZodRawShape, z } from 'zod';

interface RequestContext {
  params: {
    id: string;
  };
}

const putPostSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  author: z.string(),
  tags: z.array(z.string()),
});

const assertContentType =
  (contentType: 'application/json' | 'application/xml') =>
  async (request: NextRequest, _context: RequestContext, next: NextHandler) => {
    if (request.headers.get('content-type') !== contentType) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      );
    }

    return next();
  };

const validatePayload =
  <T extends ZodRawShape>(schema: z.ZodObject<T>) =>
  async (request: NextRequest, _context: RequestContext) => {
    const parseResult = await schema.safeParseAsync((await request.json()));

    if (!parseResult.success) {
      const error = parseResult.error;
      return NextResponse.json({ error }, { status: 400 });
    }

    return parseResult.data; 
  };

const router = createEdgeRouter<NextRequest, RequestContext>();

router
  .get(async (_request, context) => {
    const id = +context.params.id;
    const post = await getPost(id);

    return post
      ? NextResponse.json(post)
      : NextResponse.json({ error: 'Post not found' }, { status: 404 });
  })
  .use(assertContentType('application/json'))
  .put(async (request, context) => {
    const result = await validatePayload(putPostSchema)(request, context);
    if (result instanceof NextResponse) {
      return result;
    }
    
    const id = +context.params.id;
    const updated = await updatePost(id, result);
    if (!updated) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const location = `${request.nextUrl.href}/${updated.id}`;
    return NextResponse.json(updated, { status: 200, headers: { location } });
  });

  export async function GET(request: NextRequest, ctx: RequestContext) {
    return router.run(request, ctx);
  }
  
  export async function PUT(request: NextRequest, ctx: RequestContext) {
    return router.run(request, ctx);
  }
