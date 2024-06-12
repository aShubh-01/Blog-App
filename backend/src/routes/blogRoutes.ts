import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { authMiddleware, initPrismaClient } from '../middlewares/userMiddleware';
import { blogPostSchema, blogPostType, updateBlogPostSchema, updateBlogType } from '@ashubh/medium-com';

const blogRouter = new Hono<{
    Bindings: {
      DATABASE_URL: string
    },
    Variables: {
      userId: string,
      prisma: PrismaClient
    }
}>();

blogRouter.use('/*', authMiddleware);
blogRouter.use('/*', initPrismaClient);

blogRouter.post('/', async (c) => {
    const prisma = c.get('prisma');
    const userId = c.get('userId');

    const blogDataBody : blogPostType = await c.req.json();
    const parseResponse = blogPostSchema.safeParse(blogDataBody);

    if(!parseResponse.success) {
        console.log(parseResponse.error);
        return c.json({
            msg: parseResponse.error.issues[0].message
        }, 411)
    }

    const post = await prisma.post.create({
        data: {
            title: blogDataBody.title,
            content: blogDataBody.content,
            authorId: userId
        }
    });

    return c.json({
        msg: "Post added"
    }, 200)
});

blogRouter.put('/', async (c) => {
    const prisma = c.get('prisma');
    const userId = c.get('userId');

    const updatedBlogDataBody : updateBlogType = await c.req.json();
    const parseResponse = updateBlogPostSchema.safeParse(updatedBlogDataBody);

    if(!parseResponse.success) {
        console.log(parseResponse.error);
        return c.json({
            msg: parseResponse.error.issues[0].message
        }, 411)
    }

    await prisma.post.update({
        where: {
            id: updatedBlogDataBody.id,
            authorId: userId
        },
        data: {
            title: updatedBlogDataBody.title,
            content: updatedBlogDataBody.content
        }
    });

    return c.text('Updated post');
});

blogRouter.get('/bulk', async (c) => {
    const prisma = c.get('prisma');

    const posts = await prisma.post.findMany({
        select: {
            title: true,
            content: true,
            published: true
        }
    });

    return c.json({
        allBlogs: posts
    }, 200);
});

blogRouter.get('/', async (c) => {
    const prisma = c.get('prisma');
    const postId = c.req.query('id');

    if(!postId){
        return c.text('Unable to find id query parameter');
    }

    const post = await prisma.post.findFirst({
        where: {
            id: parseInt(postId)
        },
        select: {
            title: true,
            content: true,
            published: true
        }
    });

    return c.json({
        blog: post
    }, 200);
});

export default blogRouter;