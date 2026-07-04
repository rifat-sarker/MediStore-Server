import prisma from "../../utils/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const getAllRiders = async (query: Record<string, unknown> = {}) => {
  const { page = 1, limit = 10 } = query;
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const [riders, total] = await Promise.all([
    prisma.riderProfile.findMany({
      skip,
      take,
      include: {
        user: { select: { name: true, email: true, phone: true } }
      }
    }),
    prisma.riderProfile.count()
  ]);

  return {
    meta: { 
      page: Number(page),
      limit: Number(limit),
      total,
      totalPage: Math.ceil(total / Number(limit))
    },
    result: riders,
  };
};

const getAvailableRiders = async () => {
  const riders = await prisma.riderProfile.findMany({
    where: { currentStatus: "AVAILABLE", isVerified: true },
    include: {
      user: { select: { name: true, email: true, phone: true } }
    }
  });
  return riders;
};

const verifyRider = async (id: string) => {
  const rider = await prisma.riderProfile.update({
    where: { id },
    data: { isVerified: true }
  });
  return rider;
};

export const RiderService = {
  getAllRiders,
  getAvailableRiders,
  verifyRider
};
