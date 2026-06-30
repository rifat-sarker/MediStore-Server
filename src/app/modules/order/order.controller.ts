import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { OrderService } from "./order.service";
import { IJwtPayload } from "../auth/auth.interface";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { OrderStatus } from "@prisma/client";

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.createOrder(
    req.body,
    req.user as unknown as IJwtPayload
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Order created successfully",
    data: result,
  });
});

const getOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getOrders(
    req.query,
    req.user as unknown as IJwtPayload
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Orders retrieved successfully",
    data: result.result,
    meta: result.meta as any,
  });
});

const getOrderDetails = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getOrderDetails(req.params.orderId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order retrieved successfully",
    data: result,
  });
});

const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getMyOrders(
    req.query,
    req.user as unknown as IJwtPayload
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My orders retrieved successfully",
    data: result.result,
    meta: result.meta as any,
  });
});

const changeOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const { status } = req.body;
  const result = await OrderService.changeOrderStatus(
    req.params.orderId,
    status as OrderStatus,
    req.user as unknown as IJwtPayload
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order status changed successfully",
    data: result,
  });
});

const verifyPrescription = catchAsync(async (req: Request, res: Response) => {
  const { action, reason } = req.body;
  const result = await OrderService.verifyPrescription(
    req.params.orderId,
    action,
    reason
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Prescription ${action}d successfully`,
    data: result,
  });
});

const assignRider = catchAsync(async (req: Request, res: Response) => {
  const { riderId } = req.body;
  const result = await OrderService.assignRiderToOrder(
    req.params.orderId,
    riderId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rider assigned successfully",
    data: result,
  });
});

const updateDeliveryStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { status } = req.body;
    const result = await OrderService.updateDeliveryStatus(
      req.params.orderId,
      status as OrderStatus,
      req.user as unknown as IJwtPayload
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Delivery status updated",
      data: result,
    });
  }
);

const getRiderDeliveries = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getRiderDeliveries(
    req.query,
    req.user as unknown as IJwtPayload
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rider deliveries retrieved successfully",
    data: result.result,
    meta: result.meta as any,
  });
});

export const OrderController = {
  createOrder,
  getOrders,
  getOrderDetails,
  getMyOrders,
  changeOrderStatus,
  verifyPrescription,
  assignRider,
  updateDeliveryStatus,
  getRiderDeliveries,
};
