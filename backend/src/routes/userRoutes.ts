import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { sign } from 'hono/jwt';
import { UserCredentialsSchema, UserCredentialsType, UserAuthSchema } from '@ashubh/mid-cmn';
import { initPrismaClient, findUser } from '../middlewares/userMiddleware';

const userRouter = new Hono<{
    Bindings: {
      DATABASE_URL: string
      JWT_KEY: string
    },
    Variables: {
        prisma: PrismaClient
    }
}>();

userRouter.use('/*', initPrismaClient);

userRouter.post('/signup', findUser, async (c) => {
    const prisma = c.get('prisma');

    const userCredentialsBody : UserCredentialsType = await c.req.json();
    const parseResponse = UserCredentialsSchema.safeParse(userCredentialsBody);

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

    try {
        const user = await prisma.user.create({
          data: {
            name: userCredentialsBody.name,
            email: userCredentialsBody.email,
            password: userCredentialsBody.password
          },
          select: {
           id: true
          }
        })
        const token = await sign({ id: user.id }, c.env.JWT_KEY);

        return c.json({
          msg: "Signed Up Successfully!",
          token: token
        }, 200);

    } catch (err) {
        console.log(err);
        return c.json({
          msg: "Error while signup"
        }, 411)

    }
});

userRouter.post('/signin', async (c) => {
  
    const prisma = c.get('prisma');
  
    type UserAuthType = Pick<UserCredentialsType, 'name' | 'password'>;
    const userAuthBody : UserAuthType = await c.req.json();
  
    const parseResponse = UserAuthSchema.safeParse(userAuthBody);
  
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
  
    try {
      const user = await prisma.user.findFirst({
        where: {
          name: userAuthBody.name,
          password: userAuthBody.password
        },
        select: {
          id: true
        }
      });
  
      if(!user) {
        return c.json({
          msg: ["Invalid Username / Password"]
        }, 411)
      }

      const token = await sign({ id: user.id }, c.env.JWT_KEY);
  
      return c.json({
        msg: "Signed In Successfully!",
        token: token
      }, 200);
  
    } catch (err) {
      console.log(err);
      return c.json({
        msg: ["Error while signing in"]
      }, 411)
  
    }
     
});

export default userRouter;