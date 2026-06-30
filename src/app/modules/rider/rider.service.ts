import prisma from "../../utils/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const getAllRiders = async () => {
  const riders = await prisma.riderProfile.findMany({
    include: {
      user: { select: { name: true, email: true, phone: true } }
    }
  });
  return riders;
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
