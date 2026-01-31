import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireRole, } from "../middleware/auth.middleware.js";
const router = Router();
// Get all categories
router.get("/", async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                medicines: true,
            },
        });
        res.json({ success: true, data: categories });
    }
    catch (error) {
        console.error("Get categories error:", error);
        return res
            .status(500)
            .json({ success: false, message: "Failed to fetch categories" });
    }
});
// Get single category
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                medicines: {
                    where: { status: "active" },
                },
            },
        });
        if (!category) {
            return res
                .status(404)
                .json({ success: false, message: "Category not found" });
        }
        res.json({ success: true, data: category });
    }
    catch (error) {
        console.error("Get category error:", error);
        return res
            .status(500)
            .json({ success: false, message: "Failed to fetch category" });
    }
});
// Create category (admin only)
router.post("/", requireAuth, requireRole("admin"), async (req, res) => {
    try {
        const { name, slug } = req.body;
        if (!name || !slug) {
            return res.status(400).json({
                success: false,
                message: "Name and slug are required",
            });
        }
        // Check if slug already exists
        const existing = await prisma.category.findUnique({
            where: { slug },
        });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Category with this slug already exists",
            });
        }
        const category = await prisma.category.create({
            data: {
                name,
                slug,
            },
        });
        return res.status(201).json({ success: true, data: category });
    }
    catch (error) {
        console.error("Create category error:", error);
        return res
            .status(500)
            .json({ success: false, message: "Failed to create category" });
    }
});
// Update category (admin only)
router.put("/:id", requireAuth, requireRole("admin"), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug } = req.body;
        const existing = await prisma.category.findUnique({
            where: { id },
        });
        if (!existing) {
            return res
                .status(404)
                .json({ success: false, message: "Category not found" });
        }
        // Check if new slug conflicts
        if (slug && slug !== existing.slug) {
            const slugExists = await prisma.category.findUnique({
                where: { slug },
            });
            if (slugExists) {
                return res.status(400).json({
                    success: false,
                    message: "Category with this slug already exists",
                });
            }
        }
        const data = {};
        if (name !== undefined)
            data.name = name;
        if (slug !== undefined)
            data.slug = slug;
        const category = await prisma.category.update({
            where: { id },
            data,
        });
        return res.json({ success: true, data: category });
    }
    catch (error) {
        console.error("Update category error:", error);
        return res
            .status(500)
            .json({ success: false, message: "Failed to update category" });
    }
});
// Delete category (admin only)
router.delete("/:id", requireAuth, requireRole("admin"), async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await prisma.category.findUnique({
            where: { id },
            include: {
                medicines: true,
            },
        });
        if (!existing) {
            return res
                .status(404)
                .json({ success: false, message: "Category not found" });
        }
        // Don't allow deletion if category has medicines
        if (existing.medicines.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete category with existing medicines",
            });
        }
        await prisma.category.delete({ where: { id } });
        return res.json({ success: true, message: "Category deleted" });
    }
    catch (error) {
        console.error("Delete category error:", error);
        return res
            .status(500)
            .json({ success: false, message: "Failed to delete category" });
    }
});
export default router;
//# sourceMappingURL=category.routes.js.map