import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/api-error.js";

export function errorHandler(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction,
) {
  if (error instanceof ApiError) {
    response.status(error.statusCode).json({
      message: error.message,
      details: error.details,
    });
    return;
  }

  if (error instanceof ZodError) {
    response.status(400).json({
      message: "요청 데이터가 올바르지 않습니다.",
      details: error.flatten(),
    });
    return;
  }

  console.error(error);

  response.status(500).json({
    message: "서버 내부 오류가 발생했습니다.",
  });
}
