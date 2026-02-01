import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import {
  requireAuth,
  requireRole,
  type AuthRequest,
} from "../middleware/auth.middleware.js";

const router = Router();

// Get seller statistics
router.get(
  "/seller",
  requireAuth,
  requireRole("seller", "admin"),
  async (req: AuthRequest, res) => {
    try {
      const sellerId = req.user?.id;
      const isAdmin = req.user?.role === "admin";
      const targetSellerId =
        isAdmin && req.query.sellerId
          ? (req.query.sellerId as string)
          : sellerId;

      if (!targetSellerId) {
        return res
          .status(400)
          .json({ success: false, message: "Seller ID is required" });
      }

      // 1. Total Products (medicines count)
      const totalProducts = await prisma.medicine.count({
        where: { sellerId: targetSellerId },
      });

      // 2. Total Orders (orders containing seller's products)
      const orderItems = await prisma.orderItem.findMany({
        where: {
          medicine: { sellerId: targetSellerId },
        },
        select: { orderId: true },
        distinct: ["orderId"],
      });
      const totalOrders = orderItems.length;

      // 3. Total Sales (sum of price * quantity for seller's items)
      const salesData = await prisma.orderItem.aggregate({
        where: {
          medicine: { sellerId: targetSellerId },
          order: {
            status: { notIn: ["cancelled"] },
          },
        },
        _sum: {
          quantity: true,
        },
      });

      // Get all order items for this seller to calculate total sales
      const sellerOrderItems = await prisma.orderItem.findMany({
        where: {
          medicine: { sellerId: targetSellerId },
          order: {
            status: { notIn: ["cancelled"] },
          },
        },
        select: {
          price: true,
          quantity: true,
        },
      });

      const totalSales = sellerOrderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // 4. Average Review (average rating from reviews on seller's medicines)
      const reviewData = await prisma.review.aggregate({
        where: {
          medicine: { sellerId: targetSellerId },
        },
        _avg: {
          rating: true,
        },
        _count: {
          rating: true,
        },
      });

      const averageReview = reviewData._avg.rating || 0;
      const totalReviews = reviewData._count.rating || 0;

      return res.json({
        success: true,
        data: {
          totalProducts,
          totalOrders,
          totalSales: Math.round(totalSales * 100) / 100,
          averageReview: Math.round(averageReview * 10) / 10,
          totalReviews,
        },
      });
    } catch (error) {
      console.error("Get seller stats error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch seller statistics" });
    }
  }
);

// Get admin statistics (overview of entire platform)
router.get(
  "/admin",
  requireAuth,
  requireRole("admin"),
  async (req: AuthRequest, res) => {
    try {
      // Total users by role
      const [totalCustomers, totalSellers, totalAdmins] = await Promise.all([
        prisma.user.count({ where: { role: "customer" } }),
        prisma.user.count({ where: { role: "seller" } }),
        prisma.user.count({ where: { role: "admin" } }),
      ]);

      // Total products
      const totalProducts = await prisma.medicine.count();

      // Total orders and sales
      const totalOrders = await prisma.order.count();

      const ordersData = await prisma.order.aggregate({
        where: {
          status: { notIn: ["cancelled"] },
        },
        _sum: {
          total: true,
        },
      });
      const totalSales = ordersData._sum.total || 0;

      // Orders by status
      const ordersByStatus = await prisma.order.groupBy({
        by: ["status"],
        _count: {
          status: true,
        },
      });

      // Average review across platform
      const reviewData = await prisma.review.aggregate({
        _avg: {
          rating: true,
        },
        _count: {
          rating: true,
        },
      });

      return res.json({
        success: true,
        data: {
          users: {
            total: totalCustomers + totalSellers + totalAdmins,
            customers: totalCustomers,
            sellers: totalSellers,
            admins: totalAdmins,
          },
          totalProducts,
          totalOrders,
          totalSales: Math.round(totalSales * 100) / 100,
          ordersByStatus: ordersByStatus.reduce(
            (acc, item) => {
              acc[item.status] = item._count.status;
              return acc;
            },
            {} as Record<string, number>
          ),
          averageReview: Math.round((reviewData._avg.rating || 0) * 10) / 10,
          totalReviews: reviewData._count.rating || 0,
        },
      });
    } catch (error) {
      console.error("Get admin stats error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch admin statistics" });
    }
  }
);

export default router;
