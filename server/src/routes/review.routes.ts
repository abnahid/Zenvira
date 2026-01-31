import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import {
  requireAuth,
  type AuthRequest,
} from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
        medicine: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
    res.json({ success: true, data: reviews });
  } catch (error) {
    console.error("Get reviews error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch reviews" });
  }
});

router.get("/medicine/:medicineId", async (req, res) => {
  try {
    const { medicineId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { medicineId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ success: true, data: reviews });
  } catch (error) {
    console.error("Get medicine reviews error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch reviews" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
        medicine: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    res.json({ success: true, data: review });
  } catch (error) {
    console.error("Get review error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch review" });
  }
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { rating, comment, medicineId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!medicineId || rating == null) {
      return res.status(400).json({
        success: false,
        message: "Medicine ID and rating are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const medicine = await prisma.medicine.findUnique({
      where: { id: medicineId },
    });

    if (!medicine) {
      return res
        .status(404)
        .json({ success: false, message: "Medicine not found" });
    }

    const existingReview = await prisma.review.findFirst({
      where: {
        medicineId,
        userId,
      },
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this medicine",
      });
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment: comment || "",
        medicineId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        medicine: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return res.status(201).json({ success: true, data: review });
  } catch (error) {
    console.error("Create review error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create review" });
  }
});

router.put("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const id = String(req.params.id);
    const { rating, comment } = req.body;

    const existing = await prisma.review.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    if (req.user?.role !== "admin" && existing.userId !== req.user?.id) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const data: Record<string, any> = {};
    if (rating !== undefined) data.rating = rating;
    if (comment !== undefined) data.comment = comment;

    const review = await prisma.review.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        medicine: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return res.json({ success: true, data: review });
  } catch (error) {
    console.error("Update review error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update review" });
  }
});

router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const id = String(req.params.id);

    const existing = await prisma.review.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    if (req.user?.role !== "admin" && existing.userId !== req.user?.id) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    await prisma.review.delete({ where: { id } });
    return res.json({ success: true, message: "Review deleted" });
  } catch (error) {
    console.error("Delete review error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete review" });
  }
});

export default router;
