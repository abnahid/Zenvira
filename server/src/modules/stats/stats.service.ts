import { prisma } from "../../lib/prisma.js";

export const statsService = {
  async getSellerStats(sellerId: string) {
    // Total Products
    const totalProducts = await prisma.medicine.count({
      where: { sellerId },
    });

    // Total Orders (orders containing seller's products)
    const orderItems = await prisma.orderItem.findMany({
      where: { medicine: { sellerId } },
      select: { orderId: true },
      distinct: ["orderId"],
    });
    const totalOrders = orderItems.length;

    // Total Sales
    const sellerOrderItems = await prisma.orderItem.findMany({
      where: {
        medicine: { sellerId },
        order: { status: { notIn: ["cancelled"] } },
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

    // Average Review
    const reviewData = await prisma.review.aggregate({
      where: { medicine: { sellerId } },
      _avg: { rating: true },
      _count: { rating: true },
    });

    const averageReview = reviewData._avg.rating || 0;
    const totalReviews = reviewData._count.rating || 0;

    return {
      totalProducts,
      totalOrders,
      totalSales: Math.round(totalSales * 100) / 100,
      averageReview: Math.round(averageReview * 10) / 10,
      totalReviews,
    };
  },

  async getAdminStats() {
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
      where: { status: { notIn: ["cancelled"] } },
      _sum: { total: true },
    });
    const totalSales = ordersData._sum.total || 0;

    // Orders by status
    const ordersByStatus = await prisma.order.groupBy({
      by: ["status"],
      _count: { status: true },
    });

    // Average review across platform
    const reviewData = await prisma.review.aggregate({
      _avg: { rating: true },
      _count: { rating: true },
    });

    return {
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
    };
  },
};
