import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import {
  requireAuth,
  requireRole,
  type AuthRequest,
} from "../middleware/auth.middleware.js";

const router = Router();

// ============ SELLER APPLICATION ROUTES ============

// Submit seller application (customer only)
router.post(
  "/seller/apply",
  requireAuth,
  async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.id;
      const { storeName, phone, address, note } = req.body;

      // Check if user is already a seller
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user?.role === "seller") {
        return res.status(400).json({
          success: false,
          message: "You are already a seller",
        });
      }

      // Check for existing application
      const existing = await prisma.sellerApplication.findUnique({
        where: { userId },
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message:
            existing.status === "pending"
              ? "You already have a pending application"
              : "You have already submitted an application",
        });
      }

      if (!storeName || !phone || !address) {
        return res.status(400).json({
          success: false,
          message: "Store name, phone, and address are required",
        });
      }

      const app = await prisma.sellerApplication.create({
        data: {
          userId,
          storeName,
          phone,
          address,
          note: note || null,
        },
      });

      res.json({
        success: true,
        message: "Application submitted for review",
        data: app,
      });
    } catch (error) {
      console.error("Submit seller application error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to submit application",
      });
    }
  }
);

// Get current user's seller application status
router.get(
  "/seller/application",
  requireAuth,
  async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.id;

      const application = await prisma.sellerApplication.findUnique({
        where: { userId },
      });

      res.json({
        success: true,
        data: application,
      });
    } catch (error) {
      console.error("Get seller application error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch application",
      });
    }
  }
);

// Get all seller applications (admin only)
router.get(
  "/seller-applications",
  requireAuth,
  requireRole("admin"),
  async (req: AuthRequest, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
      const skip = (page - 1) * limit;
      const status = req.query.status as string;

      const where: any = {};
      if (status && ["pending", "approved", "rejected"].includes(status)) {
        where.status = status;
      }

      const total = await prisma.sellerApplication.count({ where });

      const applications = await prisma.sellerApplication.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              role: true,
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
        data: applications,
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
      console.error("Get seller applications error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch applications",
      });
    }
  }
);

// Update seller application status (admin only - approve/reject)
router.put(
  "/seller-applications/:id",
  requireAuth,
  requireRole("admin"),
  async (req: AuthRequest, res) => {
    try {
      const id = req.params.id;
      const { status } = req.body;

      if (!status || !["approved", "rejected"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Status must be 'approved' or 'rejected'",
        });
      }

      const application = await prisma.sellerApplication.findUnique({
        where: { id },
      });

      if (!application) {
        return res.status(404).json({
          success: false,
          message: "Application not found",
        });
      }

      if (application.status !== "pending") {
        return res.status(400).json({
          success: false,
          message: "This application has already been processed",
        });
      }

      // Update application status
      const updatedApp = await prisma.sellerApplication.update({
        where: { id },
        data: { status },
      });

      // If approved, update user role to seller
      if (status === "approved") {
        await prisma.user.update({
          where: { id: application.userId },
          data: { role: "seller" },
        });
      }

      res.json({
        success: true,
        message: `Application ${status}`,
        data: updatedApp,
      });
    } catch (error) {
      console.error("Update seller application error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update application",
      });
    }
  }
);

// ============ USER MANAGEMENT ROUTES ============

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
