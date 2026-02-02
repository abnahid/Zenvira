import { prisma } from "../../lib/prisma.js";

export interface CreateReviewData {
  userId: string;
  medicineId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewData {
  rating?: number;
  comment?: string;
}

const reviewInclude = {
  user: {
    select: {
      id: true,
      name: true,
      image: true,
      email: true,
    },
  },
  medicine: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
};

export const reviewService = {
  async getAll() {
    return prisma.review.findMany({
      include: reviewInclude,
    });
  },

  async getByMedicineId(medicineId: string) {
    return prisma.review.findMany({
      where: { medicineId },
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
    });
  },

  async getById(id: string) {
    return prisma.review.findUnique({
      where: { id },
      include: reviewInclude,
    });
  },

  async create(data: CreateReviewData) {
    return prisma.review.create({
      data: {
        rating: data.rating,
        comment: data.comment || "",
        medicineId: data.medicineId,
        userId: data.userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        medicine: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
  },

  async update(id: string, data: UpdateReviewData) {
    const updateData: Record<string, any> = {};

    if (data.rating !== undefined) updateData.rating = data.rating;
    if (data.comment !== undefined) updateData.comment = data.comment;

    return prisma.review.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        medicine: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
  },

  async delete(id: string) {
    return prisma.review.delete({ where: { id } });
  },

  async getUserId(id: string) {
    const review = await prisma.review.findUnique({
      where: { id },
      select: { userId: true },
    });
    return review?.userId;
  },

  async hasUserReviewed(userId: string, medicineId: string) {
    const existingReview = await prisma.review.findFirst({
      where: { medicineId, userId },
    });
    return !!existingReview;
  },

  async medicineExists(medicineId: string) {
    const medicine = await prisma.medicine.findUnique({
      where: { id: medicineId },
    });
    return !!medicine;
  },
};
