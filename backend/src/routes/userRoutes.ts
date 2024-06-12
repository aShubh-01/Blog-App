import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { sign } from 'hono/jwt';
import { UserCredentialsSchema, UserCredentialsType, UserAuthSchema } from '@ashubh/medium-com';
import { initPrismaClient } from '../middlewares/userMiddleware';

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

userRouter.post('/signup', async (c) => {
    const prisma = c.get('prisma');

    const userCredentialsBody : UserCredentialsType = await c.req.json();
    const parseResponse = UserCredentialsSchema.safeParse(userCredentialsBody);

    if(!parseResponse.success) { 
      console.log(parseResponse);
      return c.json({
        msg: parseResponse.error.issues[0].message
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
      return c.json({
        msg: parseResponse.error.issues[0].message
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
          msg: "Invalid Username or Password"
        }, 411)
      }
      
      console.log(user);
      const token = await sign({ id: user.id }, c.env.JWT_KEY);
      console.log(token);
  
      return c.json({
        msg: "Signed In Successfully!",
        token: token
      }, 200);
  
    } catch (err) {
      console.log(err);
      return c.json({
        msg: "Error while signing in"
      }, 411)
  
    }
     
});

export default userRouter;