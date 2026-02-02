import { prisma } from "../../lib/prisma.js";

export interface CreateCategoryData {
  name: string;
  slug: string;
}

export interface UpdateCategoryData {
  name?: string;
  slug?: string;
}

export const categoryService = {
  async getAll() {
    return prisma.category.findMany({
      include: {
        medicines: true,
      },
    });
  },

  async getById(id: string) {
    return prisma.category.findUnique({
      where: { id },
      include: {
        medicines: {
          where: { status: "active" },
        },
      },
    });
  },

  async getBySlug(slug: string) {
    return prisma.category.findUnique({
      where: { slug },
    });
  },

  async create(data: CreateCategoryData) {
    return prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
      },
    });
  },

  async update(id: string, data: UpdateCategoryData) {
    const updateData: Record<string, any> = {};

    if (data.name !== undefined && typeof data.name === "string") {
      updateData.name = data.name;
    }
    if (data.slug !== undefined && typeof data.slug === "string") {
      updateData.slug = data.slug;
    }

    return prisma.category.update({
      where: { id },
      data: updateData,
    });
  },

  async delete(id: string) {
    return prisma.category.delete({ where: { id } });
  },

  async hasMedicines(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { medicines: true },
    });
    return category?.medicines && category.medicines.length > 0;
  },

  async exists(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
    });
    return !!category;
  },

  async slugExists(slug: string, excludeId?: string) {
    const category = await prisma.category.findUnique({
      where: { slug },
    });
    if (!category) return false;
    if (excludeId && category.id === excludeId) return false;
    return true;
  },
};
