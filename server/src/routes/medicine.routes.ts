import { Router } from "express";
import { prisma } from "../lib/prisma.ts";

const router = Router();

router.get("/", async (req, res) => {
  const meds = await prisma.medicine.findMany({
    where: { status: "active" },
    include: { category: true, seller: true },
  });
  res.json(meds);
});

export default router;
