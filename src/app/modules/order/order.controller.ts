import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { OrderService } from "./order.service";
import { IJwtPayload } from "../auth/auth.interface";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";


const createOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.createOrder(
    req.body,
    req.user as IJwtPayload
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Order created succesfully",
    data: result,
  });
});

const getOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getMyShopOrders(
    req.query,
    req.user as IJwtPayload
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order retrieved succesfully",
    data: result.result,
    meta: result.meta,
  });
});

const getOrderDetails = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getOrderDetails(req.params.orderId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order retrieved succesfully",
    data: result,
  });
});

const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getMyOrders(
    req.query,
    req.user as IJwtPayload
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order retrieved succesfully",
    data: result.result,
    meta: result.meta,
  });
});

const changeOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const { status } = req.body;
  const result = await OrderService.changeOrderStatus(
    req.params.orderId,
    status,
    req.user as IJwtPayload
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order status changed succesfully",
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getOrders,
  getOrderDetails,
  getMyOrders,
  changeOrderStatus,
};
