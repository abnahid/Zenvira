import { PrismaClient } from "@prisma/client";
import cors from "cors";
import dotenv from "dotenv";
import type { Request, Response } from "express";
import express from "express";
import medicineRoutes from "./routes/medicine.routes.ts";

dotenv.config();

const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", service: "MediStore API" });
});

app.use("/api/medicines", medicineRoutes);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
