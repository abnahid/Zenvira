import { prisma } from "../../lib/prisma.js";

export interface GetUsersParams {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
  search?: string;
}

export interface UpdateUserData {
  name?: string;
  role?: string;
  status?: string;
  image?: string;
}

export interface SellerApplicationData {
  userId: string;
  storeName: string;
  phone: string;
  address: string;
  note?: string;
}

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  image: true,
  status: true,
  emailVerified: true,
  createdAt: true,
  updatedAt: true,
};

const userSelectWithCounts = {
  ...userSelect,
  _count: {
    select: {
      medicines: true,
      orders: true,
      reviews: true,
    },
  },
};

export const userService = {
  // User Management
  async getAll(params: GetUsersParams) {
    const { page = 1, limit = 10, role, status, search } = params;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (role && ["customer", "seller", "admin"].includes(role)) {
      where.role = role;
    }

    if (status && ["active", "inactive", "banned"].includes(status)) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const total = await prisma.user.count({ where });

    const users = await prisma.user.findMany({
      where,
      select: userSelectWithCounts,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: users,
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
    return prisma.user.findUnique({
      where: { id },
      select: userSelectWithCounts,
    });
  },

  async update(id: string, data: UpdateUserData) {
    const updateData: Record<string, any> = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.role && ["customer", "seller", "admin"].includes(data.role)) {
      updateData.role = data.role;
    }
    if (data.status && ["active", "inactive", "banned"].includes(data.status)) {
      updateData.status = data.status;
    }

    return prisma.user.update({
      where: { id },
      data: updateData,
      select: userSelect,
    });
  },

  async delete(id: string) {
    return prisma.user.delete({ where: { id } });
  },

  async getRole(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });
    return user?.role;
  },

  // Profile
  async getProfile(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });
  },

  async updateProfile(id: string, data: { name?: string; image?: string }) {
    const updateData: Record<string, any> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.image !== undefined) updateData.image = data.image;

    return prisma.user.update({
      where: { id },
      data: updateData,
      select: userSelect,
    });
  },

  // Seller Applications
  async getSellerApplication(userId: string) {
    return prisma.sellerApplication.findUnique({
      where: { userId },
    });
  },

  async createSellerApplication(data: SellerApplicationData) {
    return prisma.sellerApplication.create({
      data: {
        userId: data.userId,
        storeName: data.storeName,
        phone: data.phone,
        address: data.address,
        note: data.note || null,
      },
    });
  },

  async getAllSellerApplications(params: { page?: number; limit?: number; status?: string }) {
    const { page = 1, limit = 10, status } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status && ["pending", "approved", "rejected"].includes(status)) {
      where.status = status;
    }

    const total = await prisma.sellerApplication.count({ where });

    const applications = await prisma.sellerApplication.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: applications,
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

  async getSellerApplicationById(id: string) {
    return prisma.sellerApplication.findUnique({
      where: { id },
    });
  },

  async updateSellerApplicationStatus(id: string, status: string, userId: string) {
    const updatedApp = await prisma.sellerApplication.update({
      where: { id },
      data: { status },
    });

    if (status === "approved") {
      await prisma.user.update({
        where: { id: userId },
        data: { role: "seller" },
      });
    }

    return updatedApp;
  },
};
