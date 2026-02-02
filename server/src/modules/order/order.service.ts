import { prisma } from "../../lib/prisma.js";

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  status?: string;
  customerId?: string;
}

export interface CreateOrderData {
  customerId: string;
  shippingName: string;
  shippingPhone: string;
  shippingEmail: string;
  address: string;
  paymentMethod: string;
  items: { medicineId: string; quantity: number }[];
}

const orderInclude = {
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
};

export const orderService = {
  async getAll(params: GetOrdersParams) {
    const { page = 1, limit = 10, status, customerId } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (customerId) where.customerId = customerId;
    if (status) where.status = status;

    const total = await prisma.order.count({ where });

    const orders = await prisma.order.findMany({
      where,
      include: orderInclude,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: orders,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  },

  async getById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        ...orderInclude,
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
  },

  async getSellerOrders(params: { sellerId: string; page?: number; limit?: number; status?: string }) {
    const { sellerId, page = 1, limit = 10, status } = params;
    const skip = (page - 1) * limit;

    const orderItems = await prisma.orderItem.findMany({
      where: { medicine: { sellerId } },
      select: { orderId: true },
      distinct: ["orderId"],
    });

    const orderIds = orderItems.map((item) => item.orderId);

    const whereOrder: any = { id: { in: orderIds } };
    if (status) whereOrder.status = status;

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
          where: { medicine: { sellerId } },
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

    const ordersWithSellerTotal = orders.map((order) => {
      const sellerTotal = order.items.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0
      );
      const totalItems = order.items.reduce(
        (sum: number, item: any) => sum + item.quantity,
        0
      );
      return { ...order, sellerTotal, totalItems };
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: ordersWithSellerTotal,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  },

  async getSellerOrderById(orderId: string, sellerId: string, isAdmin: boolean) {
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

    if (!order) return null;

    const sellerItems = order.items.filter(
      (item: any) => isAdmin || item.medicine.sellerId === sellerId
    );

    if (sellerItems.length === 0) return { order, sellerItems: [] };

    const sellerTotal = sellerItems.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );
    const totalItems = sellerItems.reduce(
      (sum: number, item: any) => sum + item.quantity,
      0
    );

    return {
      order: { ...order, items: sellerItems, sellerTotal, totalItems },
      sellerItems,
    };
  },

  async create(data: CreateOrderData) {
    const medicineIds = data.items.map((item) => item.medicineId);
    const medicines = await prisma.medicine.findMany({
      where: { id: { in: medicineIds }, status: "active" },
    });

    if (medicines.length !== medicineIds.length) {
      throw new Error("One or more medicines not found or inactive");
    }

    let total = 0;
    const orderItems: { medicineId: string; quantity: number; price: number }[] = [];

    for (const item of data.items) {
      const medicine = medicines.find((m) => m.id === item.medicineId);
      if (!medicine) {
        throw new Error(`Medicine ${item.medicineId} not found`);
      }

      if (medicine.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${medicine.name}. Available: ${medicine.stock}`);
      }

      const itemTotal = medicine.price * item.quantity;
      total += itemTotal;
      orderItems.push({
        medicineId: item.medicineId,
        quantity: item.quantity,
        price: medicine.price,
      });
    }

    return prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          total,
          paymentMethod: data.paymentMethod,
          shippingName: data.shippingName,
          shippingPhone: data.shippingPhone,
          shippingEmail: data.shippingEmail,
          address: data.address,
          customerId: data.customerId,
          items: { create: orderItems },
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

      for (const item of orderItems) {
        await tx.medicine.update({
          where: { id: item.medicineId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return newOrder;
    });
  },

  async updateStatus(id: string, status: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            medicine: { select: { sellerId: true } },
          },
        },
      },
    });

    if (!order) return null;

    if (status === "cancelled" && order.status !== "cancelled") {
      await prisma.$transaction(async (tx) => {
        for (const item of order.items as any[]) {
          await tx.medicine.update({
            where: { id: item.medicineId },
            data: { stock: { increment: item.quantity } },
          });
        }
        await tx.order.update({ where: { id }, data: { status } });
      });
    } else {
      await prisma.order.update({ where: { id }, data: { status } });
    }

    return prisma.order.findUnique({
      where: { id },
      include: {
        customer: { select: { id: true, name: true, email: true } },
        items: {
          include: {
            medicine: { select: { id: true, name: true, slug: true, images: true } },
          },
        },
      },
    });
  },

  async updatePaymentStatus(id: string, paymentStatus: string) {
    return prisma.order.update({
      where: { id },
      data: { paymentStatus },
      include: {
        customer: { select: { id: true, name: true, email: true } },
        items: {
          include: {
            medicine: { select: { id: true, name: true, slug: true, images: true } },
          },
        },
      },
    });
  },

  async delete(id: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) return null;

    await prisma.$transaction(async (tx) => {
      if (order.status !== "cancelled") {
        for (const item of order.items as any[]) {
          await tx.medicine.update({
            where: { id: item.medicineId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }
      await tx.orderItem.deleteMany({ where: { orderId: id } });
      await tx.order.delete({ where: { id } });
    });

    return order;
  },

  async hasSellerItems(orderId: string, sellerId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            medicine: { select: { sellerId: true } },
          },
        },
      },
    });

    if (!order) return false;

    return order.items.some((item: any) => item.medicine.sellerId === sellerId);
  },
};
