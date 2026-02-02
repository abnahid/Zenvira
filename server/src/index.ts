import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import dotenv from "dotenv";
import type { NextFunction, Request, Response } from "express";
import express from "express";
import { auth } from "./lib/auth.js";
import { categoryRoutes } from "./modules/category/index.js";
import { medicineRoutes } from "./modules/medicine/index.js";
import { orderRoutes } from "./modules/order/index.js";
import { reviewRoutes } from "./modules/review/index.js";
import { statsRoutes } from "./modules/stats/index.js";
import { userRoutes } from "./modules/user/index.js";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
  }),
);

app.use(express.json());

app.all("/api/auth/*splat", toNodeHandler(auth));

app.get("/", (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: "MediStore API is running",
    version: "1.0.0",
  });
});

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", service: "MediStore API" });
});

app.use("/api/medicines", medicineRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/user", userRoutes);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ success: false, message: "Internal server error" });
});

if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT);
}

export default app;
