import type { Request, Response } from "express";

export function notFoundHandler(_request: Request, response: Response) {
  response.status(404).json({
    message: "요청한 리소스를 찾을 수 없습니다.",
  });
}
