"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlogPostSchema = exports.blogPostSchema = exports.UserAuthSchema = exports.UserCredentialsSchema = void 0;
const zod_1 = require("zod");
exports.UserCredentialsSchema = zod_1.z.object({
    name: zod_1.z.string()
        .min(1, { message: "Name cannot be empty" }),
    email: zod_1.z.string()
        .email({ message: "Email must include valid symbols (eg. '@') and domain names (eg. gmail.com, yahoo.com)" })
        .min(1),
    password: zod_1.z.string()
        .min(6, { message: "Password must be atleast 6 characters long" })
});
exports.UserAuthSchema = exports.UserCredentialsSchema.pick({
    name: true,
    password: true
});
exports.blogPostSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, { message: "Title cannot be empty" }),
    content: zod_1.z.string().min(1, { message: "Content cannot be empty" })
});
exports.updateBlogPostSchema = exports.blogPostSchema.extend({
    id: zod_1.z.number()
});
