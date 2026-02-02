import { prisma } from "../../lib/prisma.js";

export interface GetMedicinesParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  status?: string;
  sellerId?: string;
  minPrice?: number;
  maxPrice?: number;
  manufacturer?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  activeOnly?: boolean;
}

export interface CreateMedicineData {
  name: string;
  slug: string;
  price: number;
  stock: number;
  description: string;
  manufacturer: string;
  status?: string;
  categoryId: string;
  images?: string[];
  sellerId: string;
}

export interface UpdateMedicineData {
  name?: string;
  slug?: string;
  price?: number;
  stock?: number;
  description?: string;
  manufacturer?: string;
  status?: string;
  categoryId?: string;
  images?: string[];
  sellerId?: string;
}

const medicineInclude = {
  category: true,
  seller: {
    select: {
      id: true,
      name: true,
      image: true,
      email: true,
    },
  },
};

export const medicineService = {
  async getAll(params: GetMedicinesParams) {
    const {
      page = 1,
      limit = 12,
      search = "",
      categoryId,
      status,
      sellerId,
      minPrice,
      maxPrice,
      manufacturer,
      sortBy = "createdAt",
      sortOrder = "desc",
      activeOnly = true,
    } = params;

    const skip = (page - 1) * limit;
    const allowedSortFields = ["name", "price", "createdAt", "stock"];
    const finalSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

    const where: any = {};

    if (activeOnly) {
      where.status = "active";
    } else if (status && ["active", "inactive"].includes(status)) {
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

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined && !isNaN(minPrice)) where.price.gte = minPrice;
      if (maxPrice !== undefined && !isNaN(maxPrice)) where.price.lte = maxPrice;
    }

    if (manufacturer) {
      where.manufacturer = { contains: manufacturer, mode: "insensitive" };
    }

    const total = await prisma.medicine.count({ where });

    const medicines = await prisma.medicine.findMany({
      where,
      include: medicineInclude,
      orderBy: { [finalSortBy]: sortOrder },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: medicines,
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
    return prisma.medicine.findUnique({
      where: { id },
      include: medicineInclude,
    });
  },

  async getBySlug(slug: string) {
    return prisma.medicine.findUnique({
      where: { slug },
      include: {
        ...medicineInclude,
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
  },

  async create(data: CreateMedicineData) {
    return prisma.medicine.create({
      data: {
        name: data.name,
        slug: data.slug,
        price: Number(data.price),
        stock: Number(data.stock),
        description: data.description,
        manufacturer: data.manufacturer,
        status: data.status || "active",
        categoryId: data.categoryId,
        images: data.images || [],
        sellerId: data.sellerId,
      },
    });
  },

  async update(id: string, data: UpdateMedicineData) {
    const updateData: Record<string, any> = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.price !== undefined) updateData.price = Number(data.price);
    if (data.stock !== undefined) updateData.stock = Number(data.stock);
    if (data.description !== undefined) updateData.description = data.description;
    if (data.manufacturer !== undefined) updateData.manufacturer = data.manufacturer;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.images !== undefined) updateData.images = data.images;
    if (data.sellerId !== undefined) updateData.sellerId = data.sellerId;

    return prisma.medicine.update({
      where: { id },
      data: updateData,
    });
  },

  async delete(id: string) {
    return prisma.medicine.delete({ where: { id } });
  },

  async checkOwnership(id: string, userId: string) {
    const medicine = await prisma.medicine.findUnique({
      where: { id },
      select: { sellerId: true },
    });
    return medicine?.sellerId === userId;
  },

  async getSellerId(id: string) {
    const medicine = await prisma.medicine.findUnique({
      where: { id },
      select: { sellerId: true },
    });
    return medicine?.sellerId;
  },
};
