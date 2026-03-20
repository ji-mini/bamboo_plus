import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api-error.js";
import { verifyAdminToken } from "../utils/jwt.js";

type AuthenticatedRequest = Request & {
  admin?: {
    adminUserId: string;
    email: string;
    role: string;
  };
};

export function authenticateAdmin(
  request: AuthenticatedRequest,
  _response: Response,
  next: NextFunction,
) {
  const authHeader = request.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(new ApiError(401, "관리자 인증이 필요합니다."));
  }

  try {
    const token = authHeader.replace("Bearer ", "");
    request.admin = verifyAdminToken(token);
    next();
  } catch {
    next(new ApiError(401, "유효하지 않은 토큰입니다."));
  }
}

export type { AuthenticatedRequest };
