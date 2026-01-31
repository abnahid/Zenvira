import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth, type AuthRequest } from "../middleware/auth.middleware.js";

const router = Router();

// Get current logged-in user profile
router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        status: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error("Get user profile error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch user profile" });
  }
});

// Update current user profile
router.put("/me", requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { name, image } = req.body;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    const data: { name?: string; image?: string } = {};
    if (name !== undefined) data.name = name;
    if (image !== undefined) data.image = image;

    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        status: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({ success: true, data: user });
  } catch (error) {
    console.error("Update user profile error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update user profile" });
  }
});

export default router;
