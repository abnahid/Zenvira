import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import {
  requireAuth,
  requireRole,
  type AuthRequest,
} from "../middleware/auth.middleware.js";

const router = Router();

// Get all users (admin only)
router.get(
  "/",
  requireAuth,
  requireRole("admin"),
  async (req: AuthRequest, res) => {
    try {
      // Pagination
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
      const skip = (page - 1) * limit;

      // Filters
      const role = req.query.role as string;
      const status = req.query.status as string;
      const search = req.query.search as string;

      const where: any = {};

      if (role && ["customer", "seller", "admin"].includes(role)) {
        where.role = role;
      }

      if (status && ["active", "inactive", "banned"].includes(status)) {
        where.status = status;
      }

      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ];
      }

      const total = await prisma.user.count({ where });

      const users = await prisma.user.findMany({
        where,
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
          _count: {
            select: {
              medicines: true,
              orders: true,
              reviews: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      });

      const totalPages = Math.ceil(total / limit);

      res.json({
        success: true,
        data: users,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      });
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch users" });
    }
  }
);

// Get single user by ID (admin only)
router.get(
  "/:id",
  requireAuth,
  requireRole("admin"),
  async (req: AuthRequest, res) => {
    try {
      const id = req.params.id;

      const user = await prisma.user.findUnique({
        where: { id },
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
          _count: {
            select: {
              medicines: true,
              orders: true,
              reviews: true,
            },
          },
        },
      });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      res.json({ success: true, data: user });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch user" });
    }
  }
);

// Update user (admin only)
router.put(
  "/:id",
  requireAuth,
  requireRole("admin"),
  async (req: AuthRequest, res) => {
    try {
      const id = req.params.id;
      const { name, role, status, image } = req.body;
      const adminId = req.user?.id;

      // Prevent admin from changing their own role
      if (id === adminId && role && role !== "admin") {
        return res.status(400).json({
          success: false,
          message: "You cannot change your own role",
        });
      }

      const existingUser = await prisma.user.findUnique({ where: { id } });

      if (!existingUser) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      // Prevent admin from modifying another admin
      if (existingUser.role === "admin" && id !== adminId) {
        return res.status(403).json({
          success: false,
          message: "You cannot modify another admin account",
        });
      }

      const data: any = {};
      if (name !== undefined) data.name = name;
      if (image !== undefined) data.image = image;
      if (role && ["customer", "seller", "admin"].includes(role)) {
        data.role = role;
      }
      if (status && ["active", "inactive", "banned"].includes(status)) {
        data.status = status;
      }

      const user = await prisma.user.update({
        where: { id },
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
      console.error("Update user error:", error);
      res.status(500).json({ success: false, message: "Failed to update user" });
    }
  }
);

// Delete user (admin only)
router.delete(
  "/:id",
  requireAuth,
  requireRole("admin"),
  async (req: AuthRequest, res) => {
    try {
      const id = req.params.id;
      const adminId = req.user?.id;

      // Prevent admin from deleting themselves
      if (id === adminId) {
        return res.status(400).json({
          success: false,
          message: "You cannot delete your own account",
        });
      }

      const existingUser = await prisma.user.findUnique({ where: { id } });

      if (!existingUser) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      // Prevent admin from deleting another admin
      if (existingUser.role === "admin") {
        return res.status(403).json({
          success: false,
          message: "You cannot delete another admin account",
        });
      }

      // Delete user (this will cascade delete related data based on schema)
      await prisma.user.delete({ where: { id } });

      res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({ success: false, message: "Failed to delete user" });
    }
  }
);

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
