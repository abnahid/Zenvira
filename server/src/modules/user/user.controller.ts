import type { Response } from "express";
import type { AuthRequest } from "../../shared/middleware/auth.middleware.js";
import { userService } from "./user.service.js";

export const userController = {
  async submitSellerApplication(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { storeName, phone, address, note } = req.body;

      const userRole = await userService.getRole(userId);
      if (userRole === "seller") {
        return res.status(400).json({ success: false, message: "You are already a seller" });
      }

      const existing = await userService.getSellerApplication(userId);
      if (existing) {
        return res.status(400).json({
          success: false,
          message: existing.status === "pending"
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

      const app = await userService.createSellerApplication({
        userId,
        storeName,
        phone,
        address,
        note,
      });

      res.json({ success: true, message: "Application submitted for review", data: app });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to submit application" });
    }
  },

  async getMySellerApplication(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const application = await userService.getSellerApplication(userId);
      res.json({ success: true, data: application });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch application" });
    }
  },

  async getAllSellerApplications(req: AuthRequest, res: Response) {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
      const status = req.query.status as string;

      const result = await userService.getAllSellerApplications({ page, limit, status });
      res.json({ success: true, ...result });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch applications" });
    }
  },

  async updateSellerApplicationStatus(req: AuthRequest, res: Response) {
    try {
      const id = req.params.id as string;
      const { status } = req.body;

      if (!status || !["approved", "rejected"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Status must be 'approved' or 'rejected'",
        });
      }

      const application = await userService.getSellerApplicationById(id);
      if (!application) {
        return res.status(404).json({ success: false, message: "Application not found" });
      }

      if (application.status !== "pending") {
        return res.status(400).json({
          success: false,
          message: "This application has already been processed",
        });
      }

      const updatedApp = await userService.updateSellerApplicationStatus(id, status, application.userId);

      res.json({ success: true, message: `Application ${status}`, data: updatedApp });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update application" });
    }
  },

  async getAllUsers(req: AuthRequest, res: Response) {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));

      const result = await userService.getAll({
        page,
        limit,
        role: req.query.role as string,
        status: req.query.status as string,
        search: req.query.search as string,
      });

      res.json({ success: true, ...result });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch users" });
    }
  },

  async getUserById(req: AuthRequest, res: Response) {
    try {
      const id = req.params.id as string;
      const user = await userService.getById(id);

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch user" });
    }
  },

  async updateUser(req: AuthRequest, res: Response) {
    try {
      const id = req.params.id as string;
      const { name, role, status, image } = req.body;
      const adminId = req.user?.id;

      if (id === adminId && role && role !== "admin") {
        return res.status(400).json({
          success: false,
          message: "You cannot change your own role",
        });
      }

      const existingUser = await userService.getById(id);
      if (!existingUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      if (existingUser.role === "admin" && id !== adminId) {
        return res.status(403).json({
          success: false,
          message: "You cannot modify another admin account",
        });
      }

      const user = await userService.update(id, { name, role, status, image });
      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update user" });
    }
  },

  async deleteUser(req: AuthRequest, res: Response) {
    try {
      const id = req.params.id as string;
      const adminId = req.user?.id;

      if (id === adminId) {
        return res.status(400).json({
          success: false,
          message: "You cannot delete your own account",
        });
      }

      const existingUser = await userService.getById(id);
      if (!existingUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      if (existingUser.role === "admin") {
        return res.status(403).json({
          success: false,
          message: "You cannot delete another admin account",
        });
      }

      await userService.delete(id);
      res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to delete user" });
    }
  },

  async getMyProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }

      const user = await userService.getProfile(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch user profile" });
    }
  },

  async updateMyProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { name, image } = req.body;

      if (!userId) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }

      const user = await userService.updateProfile(userId, { name, image });
      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update user profile" });
    }
  },
};
