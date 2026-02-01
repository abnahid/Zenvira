import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import {
  requireAuth,
  requireRole,
  type AuthRequest,
} from "../middleware/auth.middleware.js";

const router = Router();

// Get all medicines for admin (includes inactive)
router.get(
  "/admin",
  requireAuth,
  requireRole("admin"),
  async (req: AuthRequest, res) => {
    try {
      // Pagination
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
      const skip = (page - 1) * limit;

      // Search
      const search = (req.query.search as string) || "";

      // Filters
      const categoryId = req.query.categoryId as string;
      const status = req.query.status as string;
      const sellerId = req.query.sellerId as string;

      // Build where clause (no status filter by default - show all)
      const where: any = {};

      if (status && ["active", "inactive"].includes(status)) {
        where.status = status;
      }

      if (sellerId) {
        where.sellerId = sellerId;
      }

      if (categoryId) {
        where.categoryId = categoryId;
      }

      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { manufacturer: { contains: search, mode: "insensitive" } },
        ];
      }

      const total = await prisma.medicine.count({ where });

      const medicines = await prisma.medicine.findMany({
        where,
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
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      });

      const totalPages = Math.ceil(total / limit);

      res.json({
        success: true,
        data: medicines,
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
      console.error("Get admin medicines error:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch medicines" });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    // Pagination
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(req.query.limit as string) || 12),
    );
    const skip = (page - 1) * limit;

    // Sorting
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder =
      (req.query.sortOrder as string) === "asc" ? "asc" : "desc";
    const allowedSortFields = ["name", "price", "createdAt", "stock"];
    const finalSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";

    // Search
    const search = (req.query.search as string) || "";

    // Filters
    const categoryId = req.query.categoryId as string;
    const minPrice = parseFloat(req.query.minPrice as string);
    const maxPrice = parseFloat(req.query.maxPrice as string);
    const manufacturer = req.query.manufacturer as string;

    // Build where clause
    const where: any = { status: "active" };

    // Search filter (name, description, manufacturer)
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { manufacturer: { contains: search, mode: "insensitive" } },
      ];
    }

    // Category filter
    if (categoryId) {
      where.categoryId = categoryId;
    }

    // Price range filter
    if (!isNaN(minPrice) || !isNaN(maxPrice)) {
      where.price = {};
      if (!isNaN(minPrice)) where.price.gte = minPrice;
      if (!isNaN(maxPrice)) where.price.lte = maxPrice;
    }

    // Manufacturer filter
    if (manufacturer) {
      where.manufacturer = { contains: manufacturer, mode: "insensitive" };
    }

    // Get total count for pagination
    const total = await prisma.medicine.count({ where });

    // Fetch medicines
    const meds = await prisma.medicine.findMany({
      where,
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
      orderBy: { [finalSortBy]: sortOrder },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: meds,
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
    console.error("Get medicines error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch medicines" });
  }
});

// Get single medicine by ID (for editing)
router.get(
  "/id/:id",
  requireAuth,
  requireRole("seller", "admin"),
  async (req: AuthRequest, res) => {
    try {
      const id = req.params.id;

      const medicine = await prisma.medicine.findUnique({
        where: { id },
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

      if (!medicine) {
        return res
          .status(404)
          .json({ success: false, message: "Medicine not found" });
      }

      // Check ownership (sellers can only fetch their own medicines)
      if (req.user?.role !== "admin" && medicine.sellerId !== req.user?.id) {
        return res
          .status(403)
          .json({ success: false, message: "Access denied" });
      }

      return res.json({ success: true, data: medicine });
    } catch (error) {
      console.error("Get medicine by ID error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch medicine" });
    }
  },
);

// Get single medicine by slug
router.get("/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;

    const medicine = await prisma.medicine.findUnique({
      where: { slug },
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
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!medicine) {
      return res
        .status(404)
        .json({ success: false, message: "Medicine not found" });
    }

    res.json({ success: true, data: medicine });
  } catch (error) {
    console.error("Get medicine error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch medicine" });
  }
});

router.post(
  "/",
  requireAuth,
  requireRole("seller", "admin"),
  async (req: AuthRequest, res) => {
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

      if (
        !name ||
        !slug ||
        price == null ||
        stock == null ||
        !description ||
        !manufacturer ||
        !categoryId
      ) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      const finalSellerId =
        req.user?.role === "admin" && sellerId ? sellerId : req.user?.id;

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
    } catch (error) {
      console.error("Create medicine error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to create medicine" });
    }
  },
);

router.put(
  "/:id",
  requireAuth,
  requireRole("seller", "admin"),
  async (req: AuthRequest, res) => {
    try {
      const id = String(req.params.id);
      const {
        name,
        slug,
        price,
        stock,
        description,
        manufacturer,
        status,
        categoryId,
        images,
        sellerId,
      } = req.body;

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

      const data: Record<string, any> = {};
      if (name !== undefined) data.name = name;
      if (slug !== undefined) data.slug = slug;
      if (price !== undefined) data.price = Number(price);
      if (stock !== undefined) data.stock = Number(stock);
      if (description !== undefined) data.description = description;
      if (manufacturer !== undefined) data.manufacturer = manufacturer;
      if (status !== undefined) data.status = status;
      if (categoryId !== undefined) data.categoryId = categoryId;
      if (images !== undefined) data.images = images;
      if (req.user?.role === "admin" && sellerId !== undefined)
        data.sellerId = sellerId;

      const medicine = await prisma.medicine.update({
        where: { id },
        data,
      });

      return res.json({ success: true, data: medicine });
    } catch (error) {
      console.error("Update medicine error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to update medicine" });
    }
  },
);

router.delete(
  "/:id",
  requireAuth,
  requireRole("seller", "admin"),
  async (req: AuthRequest, res) => {
    try {
      const id = String(req.params.id);

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
    } catch (error) {
      console.error("Delete medicine error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to delete medicine" });
    }
  },
);

export default router;
