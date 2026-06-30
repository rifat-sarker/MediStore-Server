import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { RiderService } from "./rider.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const getAllRiders = catchAsync(async (req: Request, res: Response) => {
  const result = await RiderService.getAllRiders();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Riders retrieved successfully",
    data: result,
  });
});

const getAvailableRiders = catchAsync(async (req: Request, res: Response) => {
  const result = await RiderService.getAvailableRiders();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Available riders retrieved successfully",
    data: result,
  });
});

const verifyRider = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await RiderService.verifyRider(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rider verified successfully",
    data: result,
  });
});

export const RiderController = {
  getAllRiders,
  getAvailableRiders,
  verifyRider
};
