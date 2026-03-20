import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { adminLoginSchema } from "./admin.schema.js";
import { AdminService } from "./admin.service.js";

export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  login = asyncHandler(async (request: Request, response: Response) => {
    const input = adminLoginSchema.parse(request.body);
    const result = await this.adminService.login(input);

    response.json({
      message: "로그인에 성공했습니다.",
      data: result,
    });
  });
}
