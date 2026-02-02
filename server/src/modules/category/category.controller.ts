import type { Response } from "express";
import type { AuthRequest } from "../../shared/middleware/auth.middleware.js";
import { categoryService } from "./category.service.js";

export const categoryController = {
  async getAll(req: AuthRequest, res: Response) {
    try {
      const categories = await categoryService.getAll();
      res.json({ success: true, data: categories });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Failed to fetch categories" });
    }
  },

  async getById(req: AuthRequest, res: Response) {
    try {
      const id = req.params.id as string;
      const category = await categoryService.getById(id);

      if (!category) {
        return res.status(404).json({ success: false, message: "Category not found" });
      }

      res.json({ success: true, data: category });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Failed to fetch category" });
    }
  },

  async create(req: AuthRequest, res: Response) {
    try {
      const { name, slug } = req.body;

      if (!name || !slug) {
        return res.status(400).json({
          success: false,
          message: "Name and slug are required",
        });
      }

      const slugExists = await categoryService.slugExists(slug);
      if (slugExists) {
        return res.status(400).json({
          success: false,
          message: "Category with this slug already exists",
        });
      }

      const category = await categoryService.create({ name, slug });
      return res.status(201).json({ success: true, data: category });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Failed to create category" });
    }
  },

  async update(req: AuthRequest, res: Response) {
    try {
      const id = String(req.params.id);
      const { name, slug } = req.body;

      const exists = await categoryService.exists(id);
      if (!exists) {
        return res.status(404).json({ success: false, message: "Category not found" });
      }

      if (slug) {
        const slugExists = await categoryService.slugExists(slug, id);
        if (slugExists) {
          return res.status(400).json({
            success: false,
            message: "Category with this slug already exists",
          });
        }
      }

      const category = await categoryService.update(id, { name, slug });
      return res.json({ success: true, data: category });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Failed to update category" });
    }
  },

  async delete(req: AuthRequest, res: Response) {
    try {
      const id = String(req.params.id);

      const exists = await categoryService.exists(id);
      if (!exists) {
        return res.status(404).json({ success: false, message: "Category not found" });
      }

      const hasMedicines = await categoryService.hasMedicines(id);
      if (hasMedicines) {
        return res.status(400).json({
          success: false,
          message: "Cannot delete category with existing medicines",
        });
      }

      await categoryService.delete(id);
      return res.json({ success: true, message: "Category deleted" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Failed to delete category" });
    }
  },
};
