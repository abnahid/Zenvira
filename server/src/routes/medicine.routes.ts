import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

router.get("/", async (req, res) => {
  const meds = await prisma.medicine.findMany({
    where: { status: "active" },
    include: {
      category: true,
      seller: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
        },
      },
    },
  });
  res.json({ success: true, data: meds });
});

export default router;
