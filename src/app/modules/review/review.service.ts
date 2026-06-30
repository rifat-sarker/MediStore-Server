import prisma from "../../utils/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { IJwtPayload } from "../auth/auth.interface";

const createReviewIntoDB = async (
  payload: any,
  authUser: IJwtPayload
) => {
  const isMedicineExist = await prisma.medicine.findUnique({
    where: { id: payload.medicineId }
  });

  if (!isMedicineExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Medicine not found!");
  }

  const newReview = await prisma.review.create({
    data: {
      rating: payload.rating,
      comment: payload.comment,
      medicineId: payload.medicineId,
      userId: authUser.userId
    },
    include: { user: { select: { name: true, email: true } } }
  });

  return newReview;
};

const getAllReviewsFromDB = async (query: Record<string, unknown>) => {
  const { page = 1, limit = 10, medicineId } = query;
  
  const skip = (Number(page) - 1) * Number(limit);
  const filter: any = {};
  
  if (medicineId) {
    filter.medicineId = medicineId as string;
  }

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: filter,
      skip,
      take: Number(limit),
      include: {
        user: { select: { name: true, email: true } },
        medicine: true
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.review.count({ where: filter })
  ]);

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPage: Math.ceil(total / Number(limit))
    },
    result: reviews
  };
};

const deleteReviewFromDB = async (id: string, authUser: IJwtPayload) => {
  const review = await prisma.review.findUnique({ where: { id } });

  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, "Review not found");
  }

  if (authUser.role === "CUSTOMER" && review.userId !== authUser.userId) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to delete this review");
  }

  const deletedReview = await prisma.review.delete({ where: { id } });
  return deletedReview;
};

export const ReviewService = {
  createReviewIntoDB,
  getAllReviewsFromDB,
  deleteReviewFromDB,
};
