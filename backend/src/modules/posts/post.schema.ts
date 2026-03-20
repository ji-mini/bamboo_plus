import { PostCategory, PostStatus } from "@prisma/client";
import { z } from "zod";

export const postCategoryValues = Object.values(PostCategory);
export const postStatusValues = Object.values(PostStatus);

export const createPostSchema = z.object({
  title: z.string().trim().min(1).max(120),
  content: z.string().trim().min(1).max(5000),
  category: z.enum(postCategoryValues as [PostCategory, ...PostCategory[]]),
  password: z.string().trim().min(4).max(50).optional().or(z.literal("")),
});

export const publicPostQuerySchema = z.object({
  category: z
    .enum(postCategoryValues as [PostCategory, ...PostCategory[]])
    .optional(),
});

export const adminPostQuerySchema = z.object({
  status: z.enum(postStatusValues as [PostStatus, ...PostStatus[]]).optional(),
});

export const rejectPostSchema = z.object({
  reason: z.string().trim().min(1).max(300),
});
