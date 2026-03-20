import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/error-handler.js";
import { notFoundHandler } from "./middlewares/not-found.js";
import { adminAuthRouter } from "./modules/admin/admin.routes.js";
import { adminPostRouter, publicPostRouter } from "./modules/posts/post.routes.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.CLIENT_ORIGIN,
    }),
  );
  app.use(express.json());

  app.get("/health", (_request, response) => {
    response.json({ message: "ok" });
  });

  app.use("/api/posts", publicPostRouter);
  app.use("/api/admin", adminAuthRouter);
  app.use("/api/admin/posts", adminPostRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
