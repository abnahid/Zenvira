import type { Response } from "express";
import type { AuthRequest } from "../../shared/middleware/auth.middleware.js";
import { statsService } from "./stats.service.js";

export const statsController = {
  async getSellerStats(req: AuthRequest, res: Response) {
    try {
      const sellerId = req.user?.id;
      const isAdmin = req.user?.role === "admin";

      const targetSellerId = isAdmin && req.query.sellerId
        ? (req.query.sellerId as string)
        : sellerId;

      if (!targetSellerId) {
        return res.status(400).json({ success: false, message: "Seller ID is required" });
      }

      const stats = await statsService.getSellerStats(targetSellerId);
      return res.json({ success: true, data: stats });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Failed to fetch seller statistics" });
    }
  },

  async getAdminStats(req: AuthRequest, res: Response) {
    try {
      const stats = await statsService.getAdminStats();
      return res.json({ success: true, data: stats });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Failed to fetch admin statistics" });
    }
  },
};
