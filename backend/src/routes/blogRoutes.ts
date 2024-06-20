import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { authMiddleware, initPrismaClient } from '../middlewares/userMiddleware';
import { blogPostSchema, blogPostType, updateBlogPostSchema, updateBlogType } from '../../../cmn/src/index';

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

    const post = await prisma.post.create({
        data: {
            authorId: userId,
            title: blogDataBody.title,
            content: blogDataBody.content,
            createdAt: formattedDate,
            updatedAt: formattedDate,
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

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', {
        day: 'numeric', month: 'short', year: 'numeric'
    });

    await prisma.post.update({
        where: {
            id: updatedBlogDataBody.id,
            authorId: userId
        },
        data: {
            title: updatedBlogDataBody.title,
            content: updatedBlogDataBody.content,
            updatedAt: formattedDate,
            published: updatedBlogDataBody.isPublished
        }
    });

    return c.text('Updated post', 200);
});

blogRouter.get('/drafts', async(c) => {
    const prisma = c.get('prisma');
    const userId = c.get('userId');

    try {
        const posts = await prisma.post.findMany({
            where: {
                authorId: userId,
                published: false,
                isDeleted: false
            },
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        return c.json({
            drafts: posts
        }, 200);

    } catch (err) {
        return c.json({
            msg: 'Unable to get drafts'
        }, 411)
    }
});

blogRouter.get('/bulk', async (c) => {
    const prisma = c.get('prisma');
    const userId = c.get('userId');

    const posts = await prisma.post.findMany({
        where: {
            published: true,
            isDeleted: false
        },
        select: {
            author: {
                select: {
                    name: true
                }
            },
            id: true,
            savedPosts: {
                where: {
                    authorId: userId
                },
                select: {
                    postId: true
                }
            },
            title: true,
            content: true,
            createdAt: true,
        }
    });

    return c.json({
        allBlogs: posts.reverse()
    }, 200);
});

blogRouter.post('/save/:id', async (c) => {
    const userId = c.get('userId');
    const prisma = c.get('prisma');

    const id = parseInt(c.req.param('id'));

    try {
        await prisma.savedPost.create({
            data: {
                authorId: userId,
                postId: id
            }
        });
    
        return c.json({
            savedPost: "Saved Post"
        }, 200);

    } catch (err) {
        console.error(err);
        return c.text('Unable to save post', 411);
    }

});

blogRouter.delete('/unsave/:id', async(c) => {
    const prisma = c.get('prisma');
    const userId = c.get('userId');
    const id = parseInt(c.req.param('id'));

    try {
        await prisma.savedPost.delete({
            where: {
               authorId_postId: {
                authorId: userId,
                postId: id
               }
            }
        });
    
        return c.json({
            msg: "Removed post from save"
        }, 200);

    } catch (err) {
        console.error(err);
        return c.text('Unable to delete post from save', 411);
    }
});

blogRouter.get('/', async(c) => {
    const prisma = c.get('prisma');
    const userId = c.get('userId');

    try {
        const savedPosts = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                savedPosts: {
                    select: {
                        post: {
                            select: {
                                author: {
                                    select: {
                                        name: true
                                    }
                                },
                                id: true,
                                published: true,
                                isDeleted: true,
                                title: true,
                                content: true,
                                createdAt: true,
                                updatedAt: true
                            }
                        }
                    }
                }
            }
            
        });
    
        return c.json({
            savedPosts: savedPosts
        }, 200)
    } catch (err) {
        console.error(err);
        return c.text('Unable to delete post from save', 411);
    }

})

blogRouter.delete('/:id', async (c) => {
    const userId = c.get('userId');
    const prisma = c.get('prisma');
    const id = parseInt(c.req.param('id'));

    try {
        await prisma.post.update({
            where: {
                authorId: userId,
                id: id
            },
            data: {
                published: false,
                isDeleted: true
            }
        });
    
        return c.json({
            msg: "Deleted Blog"
        }, 200);

    } catch (err) {
        console.error(err);
        return c.text("Unable to delete blog", 411);
    }
});

blogRouter.get('/:id', async (c) => {
    const prisma = c.get('prisma');
    const postId = c.req.param('id');

    if(!postId){
        return c.text('Unable to find id query parameter');
    }

    try {
        const post = await prisma.post.findFirst({
            where: {
                id: parseInt(postId),
                isDeleted: false
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
                createdAt: true,
                updatedAt: true
            }
        });
    
        return c.json({
            blog: post
        }, 200);
    } catch (err) {
        console.error(err);
        return c.text('Unable to delete post from save', 411);
    }
});

export default blogRouter;