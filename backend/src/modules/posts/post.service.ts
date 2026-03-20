import bcrypt from "bcryptjs";
import { PostCategory, PostStatus } from "@prisma/client";
import { ApiError } from "../../utils/api-error.js";
import { PostRepository } from "./post.repository.js";

export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async createPost(input: {
    title: string;
    content: string;
    category: PostCategory;
    password?: string;
  }) {
    const authorPasswordHash = input.password
      ? await bcrypt.hash(input.password, 10)
      : null;

    return this.postRepository.create({
      title: input.title,
      content: input.content,
      category: input.category,
      authorPasswordHash,
    });
  }

  getApprovedPosts(category?: PostCategory) {
    return this.postRepository.findApprovedMany(category);
  }

  async getApprovedPostDetail(id: string) {
    const post = await this.postRepository.findApprovedById(id);

    if (!post) {
      throw new ApiError(404, "게시글을 찾을 수 없습니다.");
    }

    return post;
  }

  getAdminPosts(status?: PostStatus) {
    return this.postRepository.findAdminMany(status);
  }

  async approvePost(id: string) {
    const post = await this.postRepository.findById(id);

    if (!post) {
      throw new ApiError(404, "게시글을 찾을 수 없습니다.");
    }

    return this.postRepository.approve(id);
  }

  async rejectPost(id: string, reason: string) {
    const post = await this.postRepository.findById(id);

    if (!post) {
      throw new ApiError(404, "게시글을 찾을 수 없습니다.");
    }

    return this.postRepository.reject(id, reason);
  }

  async deletePost(id: string) {
    const post = await this.postRepository.findById(id);

    if (!post) {
      throw new ApiError(404, "게시글을 찾을 수 없습니다.");
    }

    return this.postRepository.delete(id);
  }
}
