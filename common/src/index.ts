import { z } from 'zod';

export const UserCredentialsSchema = z.object({
    name: z.string()
        .min(1, {message: "Name cannot be empty"}),

    email: z.string()
        .email({message: "Email must include valid symbols (eg. '@') and domain names (eg. gmail.com, yahoo.com)"})
        .min(1),

    password: z.string()
        .min(6, {message: "Password must be atleast 6 characters long"})
});

export type UserCredentialsType = z.infer<typeof UserCredentialsSchema>;

export const UserAuthSchema = UserCredentialsSchema.pick({
    name: true,
    password: true
});

export const blogPostSchema = z.object({
    title: z.string().min(1, {message: "Title cannot be empty"}),
    content: z.string().min(1, {message: "Content cannot be empty"})
});

export type blogPostType = z.infer<typeof blogPostSchema>;

export const updateBlogPostSchema = blogPostSchema.extend({
    id: z.number()
});

export type updateBlogType = z.infer<typeof updateBlogPostSchema>;