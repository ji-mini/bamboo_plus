import bcrypt from "bcryptjs";
import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/api-error.js";
import { signAdminToken } from "../../utils/jwt.js";

export class AdminService {
  async login(input: { email: string; password: string }) {
    const admin = await prisma.adminUser.findUnique({
      where: { email: input.email },
    });

    if (!admin) {
      throw new ApiError(401, "이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    const isValidPassword = await bcrypt.compare(input.password, admin.passwordHash);

    if (!isValidPassword) {
      throw new ApiError(401, "이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    const token = signAdminToken({
      adminUserId: admin.id,
      email: admin.email,
      role: admin.role,
    });

    return {
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
    };
  }
}
