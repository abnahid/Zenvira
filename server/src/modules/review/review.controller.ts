import type { Response } from "express";
import type { AuthRequest } from "../../shared/middleware/auth.middleware.js";
import { reviewService } from "./review.service.js";

export const reviewController = {
  async getAll(req: AuthRequest, res: Response) {
    try {
      const reviews = await reviewService.getAll();
      res.json({ success: true, data: reviews });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Failed to fetch reviews" });
    }
  },

  async getByMedicineId(req: AuthRequest, res: Response) {
    try {
      const medicineId = req.params.medicineId as string;
      const reviews = await reviewService.getByMedicineId(medicineId);
      res.json({ success: true, data: reviews });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Failed to fetch reviews" });
    }
  },

  async getById(req: AuthRequest, res: Response) {
    try {
      const id = req.params.id as string;
      const review = await reviewService.getById(id);

      if (!review) {
        return res.status(404).json({ success: false, message: "Review not found" });
      }

      res.json({ success: true, data: review });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Failed to fetch review" });
    }
  },

  async create(req: AuthRequest, res: Response) {
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

      const medicineExists = await reviewService.medicineExists(medicineId);
      if (!medicineExists) {
        return res.status(404).json({ success: false, message: "Medicine not found" });
      }

      const hasReviewed = await reviewService.hasUserReviewed(userId, medicineId);
      if (hasReviewed) {
        return res.status(400).json({
          success: false,
          message: "You have already reviewed this medicine",
        });
      }

      const review = await reviewService.create({
        userId,
        medicineId,
        rating,
        comment,
      });

      return res.status(201).json({ success: true, data: review });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Failed to create review" });
    }
  },

  async update(req: AuthRequest, res: Response) {
    try {
      const id = String(req.params.id);
      const { rating, comment } = req.body;

      const existingUserId = await reviewService.getUserId(id);
      if (!existingUserId) {
        return res.status(404).json({ success: false, message: "Review not found" });
      }

      if (req.user?.role !== "admin" && existingUserId !== req.user?.id) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }

      if (rating && (rating < 1 || rating > 5)) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5",
        });
      }

      const review = await reviewService.update(id, { rating, comment });
      return res.json({ success: true, data: review });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Failed to update review" });
    }
  },

  async delete(req: AuthRequest, res: Response) {
    try {
      const id = String(req.params.id);

      const existingUserId = await reviewService.getUserId(id);
      if (!existingUserId) {
        return res.status(404).json({ success: false, message: "Review not found" });
      }

      if (req.user?.role !== "admin" && existingUserId !== req.user?.id) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }

      await reviewService.delete(id);
      return res.json({ success: true, message: "Review deleted" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Failed to delete review" });
    }
  },
};
