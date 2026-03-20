import { Router } from "express";
import { authenticateAdmin } from "../../middlewares/authenticate-admin.js";
import { PostController } from "./post.controller.js";
import { PostRepository } from "./post.repository.js";
import { PostService } from "./post.service.js";

const postRepository = new PostRepository();
const postService = new PostService(postRepository);
const postController = new PostController(postService);

export const publicPostRouter = Router();
export const adminPostRouter = Router();

publicPostRouter.post("/", postController.createPost);
publicPostRouter.get("/", postController.getApprovedPosts);
publicPostRouter.get("/:id", postController.getApprovedPostDetail);

adminPostRouter.use(authenticateAdmin);
adminPostRouter.get("/", postController.getAdminPosts);
adminPostRouter.patch("/:id/approve", postController.approvePost);
adminPostRouter.patch("/:id/reject", postController.rejectPost);
adminPostRouter.delete("/:id", postController.deletePost);
