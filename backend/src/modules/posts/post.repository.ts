import type { PostCategory, PostStatus, Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";

export const postSelect = {
  id: true,
  title: true,
  content: true,
  category: true,
  status: true,
  createdAt: true,
  approvedAt: true,
  rejectedReason: true,
} satisfies Prisma.PostSelect;

export class PostRepository {
  create(data: {
    title: string;
    content: string;
    category: PostCategory;
    authorPasswordHash: string | null;
  }) {
    return prisma.post.create({
      data: {
        ...data,
        status: "PENDING",
      },
      select: postSelect,
    });
  }

  findApprovedMany(category?: PostCategory) {
    return prisma.post.findMany({
      where: {
        status: "APPROVED",
        category,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: postSelect,
    });
  }

  findApprovedById(id: string) {
    return prisma.post.findFirst({
      where: {
        id,
        status: "APPROVED",
      },
      select: postSelect,
    });
  }

  findAdminMany(status?: PostStatus) {
    return prisma.post.findMany({
      where: {
        status,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: postSelect,
    });
  }

  findById(id: string) {
    return prisma.post.findUnique({
      where: { id },
    });
  }

  approve(id: string) {
    return prisma.post.update({
      where: { id },
      data: {
        status: "APPROVED",
        approvedAt: new Date(),
        rejectedReason: null,
      },
      select: postSelect,
    });
  }

  reject(id: string, reason: string) {
    return prisma.post.update({
      where: { id },
      data: {
        status: "REJECTED",
        rejectedReason: reason,
        approvedAt: null,
      },
      select: postSelect,
    });
  }

  delete(id: string) {
    return prisma.post.delete({
      where: { id },
      select: postSelect,
    });
  }
}
