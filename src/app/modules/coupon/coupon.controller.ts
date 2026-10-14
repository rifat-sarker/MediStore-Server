import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { CouponService } from "./coupon.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const createCoupon = catchAsync(async (req: Request, res: Response) => {
  const result = await CouponService.createCoupon(req.body);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: "Coupon created", data: result });
});

const getAllCoupons = catchAsync(async (_req: Request, res: Response) => {
  const result = await CouponService.getAllCoupons();
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Coupons retrieved", data: result });
});

const applyCoupon = catchAsync(async (req: Request, res: Response) => {
  const { code, amount } = req.body;
  const result = await CouponService.applyCoupon(code, Number(amount));
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Coupon applied", data: result });
});

const deleteCoupon = catchAsync(async (req: Request, res: Response) => {
  const result = await CouponService.deleteCoupon(req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: result.message, data: null });
});

const toggleCoupon = catchAsync(async (req: Request, res: Response) => {
  const result = await CouponService.toggleCoupon(req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Coupon updated", data: result });
});

export const CouponController = {
  createCoupon,
  getAllCoupons,
  applyCoupon,
  deleteCoupon,
  toggleCoupon,
};
