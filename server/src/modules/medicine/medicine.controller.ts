import type { Response } from "express";
import type { AuthRequest } from "../../shared/middleware/auth.middleware.js";
import { medicineService } from "./medicine.service.js";

export const medicineController = {
  async getAllForAdmin(req: AuthRequest, res: Response) {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));

      const result = await medicineService.getAll({
        page,
        limit,
        search: req.query.search as string,
        categoryId: req.query.categoryId as string,
        status: req.query.status as string,
        sellerId: req.query.sellerId as string,
        activeOnly: false,
      });

      res.json({ success: true, ...result });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch medicines" });
    }
  },

  async getAll(req: AuthRequest, res: Response) {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 12));

      let sortByParam = (req.query.sortBy as string) || "createdAt";
      let sortOrder: "asc" | "desc" = "desc";

      if (sortByParam.startsWith("-")) {
        sortByParam = sortByParam.substring(1);
        sortOrder = "desc";
      } else if (sortByParam === "price" || sortByParam === "name") {
        sortOrder = "asc";
      }

      const result = await medicineService.getAll({
        page,
        limit,
        search: req.query.search as string,
        categoryId: req.query.categoryId as string,
        minPrice: parseFloat(req.query.minPrice as string),
        maxPrice: parseFloat(req.query.maxPrice as string),
        manufacturer: req.query.manufacturer as string,
        sortBy: sortByParam,
        sortOrder,
        activeOnly: true,
      });

      res.json({ success: true, ...result });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch medicines" });
    }
  },

  async getById(req: AuthRequest, res: Response) {
    try {
      const id = String(req.params.id);
      const medicine = await medicineService.getById(id);

      if (!medicine) {
        return res.status(404).json({ success: false, message: "Medicine not found" });
      }

      if (req.user?.role !== "admin" && medicine.sellerId !== req.user?.id) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }

      return res.json({ success: true, data: medicine });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Failed to fetch medicine" });
    }
  },

  async getBySlug(req: AuthRequest, res: Response) {
    try {
      const slug = req.params.slug as string;
      const medicine = await medicineService.getBySlug(slug);

      if (!medicine) {
        return res.status(404).json({ success: false, message: "Medicine not found" });
      }

      res.json({ success: true, data: medicine });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch medicine" });
    }
  },

  async create(req: AuthRequest, res: Response) {
    try {
      const {
        name,
        slug,
        price,
        stock,
        description,
        manufacturer,
        status = "active",
        categoryId,
        images = [],
        sellerId,
      } = req.body;

      if (!name || !slug || price == null || stock == null || !description || !manufacturer || !categoryId) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }

      const finalSellerId = req.user?.role === "admin" && sellerId ? sellerId : req.user?.id;

      if (!finalSellerId) {
        return res.status(400).json({ success: false, message: "Seller is required" });
      }

      const medicine = await medicineService.create({
        name,
        slug,
        price,
        stock,
        description,
        manufacturer,
        status,
        categoryId,
        images,
        sellerId: finalSellerId,
      });

      return res.status(201).json({ success: true, data: medicine });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Failed to create medicine" });
    }
  },

  async update(req: AuthRequest, res: Response) {
    try {
      const id = String(req.params.id);
      const { name, slug, price, stock, description, manufacturer, status, categoryId, images, sellerId } = req.body;

      const existingSellerId = await medicineService.getSellerId(id);

      if (!existingSellerId) {
        return res.status(404).json({ success: false, message: "Medicine not found" });
      }

      if (req.user?.role !== "admin" && existingSellerId !== req.user?.id) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }

      const updateData: any = { name, slug, price, stock, description, manufacturer, status, categoryId, images };
      if (req.user?.role === "admin" && sellerId !== undefined) {
        updateData.sellerId = sellerId;
      }

      const medicine = await medicineService.update(id, updateData);

      return res.json({ success: true, data: medicine });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Failed to update medicine" });
    }
  },

  async delete(req: AuthRequest, res: Response) {
    try {
      const id = String(req.params.id);

      const existingSellerId = await medicineService.getSellerId(id);

      if (!existingSellerId) {
        return res.status(404).json({ success: false, message: "Medicine not found" });
      }

      if (req.user?.role !== "admin" && existingSellerId !== req.user?.id) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }

      await medicineService.delete(id);
      return res.json({ success: true, message: "Medicine deleted" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Failed to delete medicine" });
    }
  },
};
