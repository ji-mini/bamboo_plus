import { Router } from "express";
import { AdminController } from "./admin.controller.js";
import { AdminService } from "./admin.service.js";

const adminService = new AdminService();
const adminController = new AdminController(adminService);

export const adminAuthRouter = Router();

adminAuthRouter.post("/login", adminController.login);
