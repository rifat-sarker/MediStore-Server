import prisma from "../../utils/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createCoupon = async (data: {
  code: string;
  discountPct: number;
  expiryDate: string;
}) => {
  const coupon = await prisma.coupon.create({
    data: {
      code: data.code.toUpperCase(),
      discountPct: data.discountPct,
      expiryDate: new Date(data.expiryDate),
      isActive: true,
    },
  });
  return coupon;
};

const getAllCoupons = async () => {
  return await prisma.coupon.findMany({ orderBy: { expiryDate: "asc" } });
};

const applyCoupon = async (code: string, amount: number) => {
  const coupon = await prisma.coupon.findFirst({
    where: { code: code.toUpperCase(), isActive: true },
  });

  if (!coupon) throw new AppError(httpStatus.NOT_FOUND, "Invalid or inactive coupon code");

  if (new Date() > coupon.expiryDate) {
    throw new AppError(httpStatus.BAD_REQUEST, "Coupon has expired");
  }

  const discountAmount = (amount * coupon.discountPct) / 100;
  const discountedTotal = amount - discountAmount;

  return {
    code: coupon.code,
    discountPct: coupon.discountPct,
    discountAmount: parseFloat(discountAmount.toFixed(2)),
    originalAmount: amount,
    discountedTotal: parseFloat(discountedTotal.toFixed(2)),
  };
};

const deleteCoupon = async (id: string) => {
  await prisma.coupon.delete({ where: { id } });
  return { message: "Coupon deleted" };
};

const toggleCoupon = async (id: string) => {
  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) throw new AppError(httpStatus.NOT_FOUND, "Coupon not found");
  return await prisma.coupon.update({
    where: { id },
    data: { isActive: !coupon.isActive },
  });
};

export const CouponService = {
  createCoupon,
  getAllCoupons,
  applyCoupon,
  deleteCoupon,
  toggleCoupon,
};
