import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import {
  adminPostQuerySchema,
  createPostSchema,
  publicPostQuerySchema,
  rejectPostSchema,
} from "./post.schema.js";
import { PostService } from "./post.service.js";

export class PostController {
  constructor(private readonly postService: PostService) {}

  private getParamId(request: Request) {
    const { id } = request.params;
    return Array.isArray(id) ? id[0] : id;
  }

  createPost = asyncHandler(async (request: Request, response: Response) => {
    const input = createPostSchema.parse(request.body);

    const post = await this.postService.createPost({
      title: input.title,
      content: input.content,
      category: input.category,
      password: input.password || undefined,
    });

    response.status(201).json({
      message: "게시글이 등록되었습니다. 관리자 승인 후 공개됩니다.",
      data: post,
    });
  });

  getApprovedPosts = asyncHandler(async (request: Request, response: Response) => {
    const query = publicPostQuerySchema.parse(request.query);
    const posts = await this.postService.getApprovedPosts(query.category);

    response.json({ data: posts });
  });

  getApprovedPostDetail = asyncHandler(async (request: Request, response: Response) => {
    const post = await this.postService.getApprovedPostDetail(this.getParamId(request));

    response.json({ data: post });
  });

  getAdminPosts = asyncHandler(async (request: Request, response: Response) => {
    const query = adminPostQuerySchema.parse(request.query);
    const posts = await this.postService.getAdminPosts(query.status);

    response.json({ data: posts });
  });

  approvePost = asyncHandler(async (request: Request, response: Response) => {
    const post = await this.postService.approvePost(this.getParamId(request));

    response.json({
      message: "게시글이 승인되었습니다.",
      data: post,
    });
  });

  rejectPost = asyncHandler(async (request: Request, response: Response) => {
    const input = rejectPostSchema.parse(request.body);
    const post = await this.postService.rejectPost(this.getParamId(request), input.reason);

    response.json({
      message: "게시글이 반려되었습니다.",
      data: post,
    });
  });

  deletePost = asyncHandler(async (request: Request, response: Response) => {
    const post = await this.postService.deletePost(this.getParamId(request));

    response.json({
      message: "게시글이 삭제되었습니다.",
      data: post,
    });
  });
}
