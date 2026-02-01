import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import dotenv from "dotenv";
import type { NextFunction, Request, Response } from "express";
import express from "express";
import { auth } from "./lib/auth.js";
import categoryRoutes from "./routes/category.routes.js";
import medicineRoutes from "./routes/medicine.routes.js";
import orderRoutes from "./routes/order.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import statsRoutes from "./routes/stats.routes.js";
import userRoutes from "./routes/user.routes.js";

// Load environment variables in development
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const app = express();

// CORS configuration
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

// Root endpoint
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
  console.error("Error:", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export Express app for Vercel serverless function
export default app;
