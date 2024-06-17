import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { authMiddleware, initPrismaClient } from '../middlewares/userMiddleware';
import { blogPostSchema, blogPostType, updateBlogPostSchema, updateBlogType } from '../../../cmn/dist/index';

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

blogRouter.post('/publish', async (c) => {
    const prisma = c.get('prisma');
    const userId = c.get('userId');

    const blogDataBody : blogPostType = await c.req.json();
    const parseResponse = blogPostSchema.safeParse(blogDataBody);

    if(!parseResponse.success) {
        console.log(parseResponse.error);
        let issues : string[] = [];

        parseResponse.error.issues.map((issue) => {
            issues.push(issue.message);
        });

        return c.json({
            msg: issues
        }, 411);
    }

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', {
        day: 'numeric', month: 'short', year: 'numeric'
    });

    await prisma.post.create({
        data: {
            title: blogDataBody.title,
            content: blogDataBody.content,
            authorId: userId,
            createdAt: formattedDate,
            published: blogDataBody.isPublished
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
        let issues : string[] = [];

        parseResponse.error.issues.map((issue) => {
            issues.push(issue.message);
        });

        return c.json({
            msg: issues
        }, 411);
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

blogRouter.get('/drafts', async(c) => {
    const prisma = c.get('prisma');
    const userId = c.get('userId');

    try {
        const posts = await prisma.post.findMany({
            where: {
                authorId: userId,
                published: false
            },
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
            }
        });

        console.log('Posts ', posts);

        return c.json({
            drafts: posts
        }, 200);

    } catch (err) {
        return c.json({
            msg: 'Unable to get drafts'
        }, 200)
    }
});

blogRouter.get('/bulk', async (c) => {
    const prisma = c.get('prisma');

    const posts = await prisma.post.findMany({
        where: {
            published: true
        },
        select: {
            author: {
                select: {
                    name: true
                }
            },
            id: true,
            title: true,
            content: true,
            createdAt: true
        }
    });

    return c.json({
        allBlogs: posts
    }, 200);
});

blogRouter.get('/:id', async (c) => {
    const prisma = c.get('prisma');
    const postId = c.req.param('id');

    if(!postId){
        return c.text('Unable to find id query parameter');
    }

    const post = await prisma.post.findFirst({
        where: {
            id: parseInt(postId)
        },
        select: {
            author: {
                select: {
                    name: true
                }
            },
            id: true,
            title: true,
            content: true,
            published: true,
            createdAt: true
        }
    });

    return c.json({
        blog: post
    }, 200);
});

export default blogRouter;