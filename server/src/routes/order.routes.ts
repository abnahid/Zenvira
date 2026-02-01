import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import {
  requireAuth,
  requireRole,
  type AuthRequest,
} from "../middleware/auth.middleware.js";

const router = Router();

// Get seller's orders (orders containing their products)
router.get(
  "/seller",
  requireAuth,
  requireRole("seller", "admin"),
  async (req: AuthRequest, res) => {
    try {
      const sellerId = req.user?.id;
      const isAdmin = req.user?.role === "admin";

      // Pagination
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
      const skip = (page - 1) * limit;

      // Filter by status
      const status = req.query.status as string;

      // Find orders that contain seller's medicines
      const whereItems: any = {
        medicine: {
          sellerId: isAdmin && req.query.sellerId
            ? (req.query.sellerId as string)
            : sellerId,
        },
      };

      // Get unique order IDs that contain seller's products
      const orderItems = await prisma.orderItem.findMany({
        where: whereItems,
        select: { orderId: true },
        distinct: ["orderId"],
      });

      const orderIds = orderItems.map((item) => item.orderId);

      const whereOrder: any = {
        id: { in: orderIds },
      };

      if (status) {
        whereOrder.status = status;
      }

      const total = await prisma.order.count({ where: whereOrder });

      const orders = await prisma.order.findMany({
        where: whereOrder,
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          items: {
            where: {
              medicine: {
                sellerId: isAdmin && req.query.sellerId
                  ? (req.query.sellerId as string)
                  : sellerId,
              },
            },
            include: {
              medicine: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  images: true,
                  price: true,
                  sellerId: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      });

      // Calculate seller's total for each order
      const ordersWithSellerTotal = orders.map((order) => {
        const sellerTotal = order.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
        return {
          ...order,
          sellerTotal,
          totalItems,
        };
      });

      const totalPages = Math.ceil(total / limit);

      res.json({
        success: true,
        data: ordersWithSellerTotal,
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
      console.error("Get seller orders error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch seller orders" });
    }
  },
);

// Get single order for seller (with their items only)
router.get(
  "/seller/:id",
  requireAuth,
  requireRole("seller", "admin"),
  async (req: AuthRequest, res) => {
    try {
      const orderId = req.params.id;
      const sellerId = req.user?.id;
      const isAdmin = req.user?.role === "admin";

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          items: {
            include: {
              medicine: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  images: true,
                  price: true,
                  manufacturer: true,
                  sellerId: true,
                },
              },
            },
          },
        },
      });

      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });
      }

      // Filter items to only show seller's products
      const sellerItems = order.items.filter(
        (item) => isAdmin || item.medicine.sellerId === sellerId
      );

      if (sellerItems.length === 0) {
        return res
          .status(403)
          .json({ success: false, message: "No items from this seller in this order" });
      }

      const sellerTotal = sellerItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const totalItems = sellerItems.reduce((sum, item) => sum + item.quantity, 0);

      res.json({
        success: true,
        data: {
          ...order,
          items: sellerItems,
          sellerTotal,
          totalItems,
        },
      });
    } catch (error) {
      console.error("Get seller order error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch order" });
    }
  },
);

// Get all orders (customers see their own, admin sees all)
router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const isAdmin = req.user?.role === "admin";

    // Pagination
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
    const skip = (page - 1) * limit;

    // Filter by status
    const status = req.query.status as string;

    const where: any = {};

    // Customers can only see their own orders
    if (!isAdmin) {
      where.customerId = userId;
    }

    // Admin can filter by customerId
    if (isAdmin && req.query.customerId) {
      where.customerId = req.query.customerId as string;
    }

    if (status) {
      where.status = status;
    }

    const total = await prisma.order.count({ where });

    const orders = await prisma.order.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        items: {
          include: {
            medicine: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: true,
                price: true,
              },
            },
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
      data: orders,
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
    console.error("Get orders error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
});

// Get single order by ID
router.get("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const id = req.params.id;
    const userId = req.user?.id;
    const isAdmin = req.user?.role === "admin";

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        items: {
          include: {
            medicine: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: true,
                price: true,
                manufacturer: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Customers can only view their own orders
    if (!isAdmin && order.customerId !== userId) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied" });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch order" });
  }
});

// Create order
router.post("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const {
      shippingName,
      shippingPhone,
      shippingEmail,
      address,
      paymentMethod = "cod",
      items,
    } = req.body;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication required" });
    }

    if (!shippingName || !shippingPhone || !shippingEmail || !address) {
      return res.status(400).json({
        success: false,
        message: "Shipping name, phone, email, and address are required",
      });
    }

    // Validate payment method
    const validPaymentMethods = ["cod"];
    if (!validPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: `Invalid payment method. Must be one of: ${validPaymentMethods.join(", ")}`,
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Order items are required" });
    }

    // Validate items and check stock
    const medicineIds = items.map((item: any) => item.medicineId);
    const medicines = await prisma.medicine.findMany({
      where: { id: { in: medicineIds }, status: "active" },
    });

    if (medicines.length !== medicineIds.length) {
      return res
        .status(400)
        .json({ success: false, message: "One or more medicines not found or inactive" });
    }

    // Check stock and calculate total
    let total = 0;
    const orderItems: { medicineId: string; quantity: number; price: number }[] = [];

    for (const item of items) {
      const medicine = medicines.find((m) => m.id === item.medicineId);
      if (!medicine) {
        return res
          .status(400)
          .json({ success: false, message: `Medicine ${item.medicineId} not found` });
      }

      if (medicine.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${medicine.name}. Available: ${medicine.stock}`,
        });
      }

      const itemTotal = medicine.price * item.quantity;
      total += itemTotal;
      orderItems.push({
        medicineId: item.medicineId,
        quantity: item.quantity,
        price: medicine.price,
      });
    }

    // Create order with items and update stock in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          total,
          paymentMethod,
          shippingName,
          shippingPhone,
          shippingEmail,
          address,
          customerId: userId,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              medicine: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  images: true,
                },
              },
            },
          },
        },
      });

      // Update stock for each medicine
      for (const item of orderItems) {
        await tx.medicine.update({
          where: { id: item.medicineId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return newOrder;
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
});

// Update order status (admin/seller only)
router.put(
  "/:id/status",
  requireAuth,
  requireRole("admin", "seller"),
  async (req: AuthRequest, res) => {
    try {
      const id = req.params.id;
      const { status } = req.body;
      const sellerId = req.user?.id;
      const isAdmin = req.user?.role === "admin";

      const validStatuses = ["placed", "confirmed", "shipped", "delivered", "cancelled"];
      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        });
      }

      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          items: {
            include: {
              medicine: {
                select: { sellerId: true },
              },
            },
          },
        },
      });

      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });
      }

      // Sellers can only update orders containing their products
      if (!isAdmin) {
        const hasSellerItems = order.items.some(
          (item) => item.medicine.sellerId === sellerId
        );
        if (!hasSellerItems) {
          return res
            .status(403)
            .json({ success: false, message: "Access denied" });
        }
      }

      // If cancelling, restore stock
      if (status === "cancelled" && order.status !== "cancelled") {
        await prisma.$transaction(async (tx) => {
          // Restore stock for each item
          for (const item of order.items) {
            await tx.medicine.update({
              where: { id: item.medicineId },
              data: { stock: { increment: item.quantity } },
            });
          }

          // Update order status
          await tx.order.update({
            where: { id },
            data: { status },
          });
        });
      } else {
        await prisma.order.update({
          where: { id },
          data: { status },
        });
      }

      const updatedOrder = await prisma.order.findUnique({
        where: { id },
        include: {
          customer: {
            select: { id: true, name: true, email: true },
          },
          items: {
            include: {
              medicine: {
                select: { id: true, name: true, slug: true, images: true },
              },
            },
          },
        },
      });

      res.json({ success: true, data: updatedOrder });
    } catch (error) {
      console.error("Update order status error:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to update order status" });
    }
  },
);

// Update payment status (admin only)
router.put(
  "/:id/payment",
  requireAuth,
  requireRole("admin"),
  async (req: AuthRequest, res) => {
    try {
      const id = req.params.id;
      const { paymentStatus } = req.body;

      const validPaymentStatuses = ["pending", "paid"];
      if (!paymentStatus || !validPaymentStatuses.includes(paymentStatus)) {
        return res.status(400).json({
          success: false,
          message: `Invalid payment status. Must be one of: ${validPaymentStatuses.join(", ")}`,
        });
      }

      const order = await prisma.order.findUnique({ where: { id } });

      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });
      }

      const updatedOrder = await prisma.order.update({
        where: { id },
        data: { paymentStatus },
        include: {
          customer: {
            select: { id: true, name: true, email: true },
          },
          items: {
            include: {
              medicine: {
                select: { id: true, name: true, slug: true, images: true },
              },
            },
          },
        },
      });

      res.json({ success: true, data: updatedOrder });
    } catch (error) {
      console.error("Update payment status error:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to update payment status" });
    }
  },
);

// Delete order (admin only, or customer can cancel pending orders)
router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const id = req.params.id;
    const userId = req.user?.id;
    const isAdmin = req.user?.role === "admin";

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Customers can only delete their own pending orders
    if (!isAdmin) {
      if (order.customerId !== userId) {
        return res
          .status(403)
          .json({ success: false, message: "Access denied" });
      }
      if (order.status !== "placed") {
        return res.status(400).json({
          success: false,
          message: "Can only cancel orders with 'placed' status",
        });
      }
    }

    // Restore stock and delete order
    await prisma.$transaction(async (tx) => {
      // Restore stock if order wasn't already cancelled
      if (order.status !== "cancelled") {
        for (const item of order.items) {
          await tx.medicine.update({
            where: { id: item.medicineId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }

      // Delete order items first
      await tx.orderItem.deleteMany({ where: { orderId: id } });

      // Delete order
      await tx.order.delete({ where: { id } });
    });

    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("Delete order error:", error);
    res.status(500).json({ success: false, message: "Failed to delete order" });
  }
});

export default router;
