import { z } from 'zod';
export declare const UserCredentialsSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
}, {
    name: string;
    email: string;
    password: string;
}>;
export type UserCredentialsType = z.infer<typeof UserCredentialsSchema>;
export declare const UserAuthSchema: z.ZodObject<Pick<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, "name" | "password">, "strip", z.ZodTypeAny, {
    name: string;
    password: string;
}, {
    name: string;
    password: string;
}>;
export declare const blogPostSchema: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    content: string;
}, {
    title: string;
    content: string;
}>;
export type blogPostType = z.infer<typeof blogPostSchema>;
export declare const updateBlogPostSchema: z.ZodObject<z.objectUtil.extendShape<{
    title: z.ZodString;
    content: z.ZodString;
}, {
    id: z.ZodNumber;
}>, "strip", z.ZodTypeAny, {
    title: string;
    content: string;
    id: number;
}, {
    title: string;
    content: string;
    id: number;
}>;
export type updateBlogType = z.infer<typeof updateBlogPostSchema>;
