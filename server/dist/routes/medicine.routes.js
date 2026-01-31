import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireRole, } from "../middleware/auth.middleware.js";
const router = Router();
router.get("/", async (req, res) => {
    const meds = await prisma.medicine.findMany({
        where: { status: "active" },
        include: {
            category: true,
            seller: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    email: true,
                },
            },
        },
    });
    res.json({ success: true, data: meds });
});
router.post("/", requireAuth, requireRole("seller", "admin"), async (req, res) => {
    try {
        const { name, slug, price, stock, description, manufacturer, status = "active", categoryId, images = [], sellerId, } = req.body;
        if (!name ||
            !slug ||
            price == null ||
            stock == null ||
            !description ||
            !manufacturer ||
            !categoryId) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }
        const finalSellerId = req.user?.role === "admin" && sellerId ? sellerId : req.user?.id;
        if (!finalSellerId) {
            return res
                .status(400)
                .json({ success: false, message: "Seller is required" });
        }
        const medicine = await prisma.medicine.create({
            data: {
                name,
                slug,
                price: Number(price),
                stock: Number(stock),
                description,
                manufacturer,
                status,
                categoryId,
                images,
                sellerId: finalSellerId,
            },
        });
        return res.status(201).json({ success: true, data: medicine });
    }
    catch (error) {
        console.error("Create medicine error:", error);
        return res
            .status(500)
            .json({ success: false, message: "Failed to create medicine" });
    }
});
router.put("/:id", requireAuth, requireRole("seller", "admin"), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug, price, stock, description, manufacturer, status, categoryId, images, sellerId, } = req.body;
        const existing = await prisma.medicine.findUnique({
            where: { id },
            select: { sellerId: true },
        });
        if (!existing) {
            return res
                .status(404)
                .json({ success: false, message: "Medicine not found" });
        }
        if (req.user?.role !== "admin" && existing.sellerId !== req.user?.id) {
            return res
                .status(403)
                .json({ success: false, message: "Access denied" });
        }
        const data = {};
        if (name !== undefined)
            data.name = name;
        if (slug !== undefined)
            data.slug = slug;
        if (price !== undefined)
            data.price = Number(price);
        if (stock !== undefined)
            data.stock = Number(stock);
        if (description !== undefined)
            data.description = description;
        if (manufacturer !== undefined)
            data.manufacturer = manufacturer;
        if (status !== undefined)
            data.status = status;
        if (categoryId !== undefined)
            data.categoryId = categoryId;
        if (images !== undefined)
            data.images = images;
        if (req.user?.role === "admin" && sellerId !== undefined)
            data.sellerId = sellerId;
        const medicine = await prisma.medicine.update({
            where: { id },
            data,
        });
        return res.json({ success: true, data: medicine });
    }
    catch (error) {
        console.error("Update medicine error:", error);
        return res
            .status(500)
            .json({ success: false, message: "Failed to update medicine" });
    }
});
router.delete("/:id", requireAuth, requireRole("seller", "admin"), async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await prisma.medicine.findUnique({
            where: { id },
            select: { sellerId: true },
        });
        if (!existing) {
            return res
                .status(404)
                .json({ success: false, message: "Medicine not found" });
        }
        if (req.user?.role !== "admin" && existing.sellerId !== req.user?.id) {
            return res
                .status(403)
                .json({ success: false, message: "Access denied" });
        }
        await prisma.medicine.delete({ where: { id } });
        return res.json({ success: true, message: "Medicine deleted" });
    }
    catch (error) {
        console.error("Delete medicine error:", error);
        return res
            .status(500)
            .json({ success: false, message: "Failed to delete medicine" });
    }
});
export default router;
//# sourceMappingURL=medicine.routes.js.map