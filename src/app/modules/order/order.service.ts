import mongoose, { Types } from "mongoose";
import { IJwtPayload } from "../auth/auth.interface";

import { IOrder } from "./order.interface";
import { Order } from "./order.model";

import QueryBuilder from "../../builder/QueryBuilder";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";

const createOrder = async (
  orderData: Partial<IOrder>,
  authUser: IJwtPayload
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (orderData.products) {
      for (const productItem of orderData.products) {
        const product = await Product.findById(productItem.product).session(
          session
        );

        if (product) {
          if (product.stock < productItem.quantity) {
            throw new Error(`Insufficient stock for product: ${product.name}`);
          }
          // Decrement the product stock
          product.stock -= productItem.quantity;
          await product.save({ session });
        } else {
          throw new Error(`Product not found: ${productItem.product}`);
        }
      }
    }

    // Create the order
    const order = new Order({
      ...orderData,
      user: authUser.userId,
    });

    const createdOrder = await order.save({ session });
    await createdOrder.populate("user products.product");

    const transactionId = generateTransactionId();

    const payment = new Payment({
      user: authUser.userId,

      order: createdOrder._id,
      method: orderData.paymentMethod,
      transactionId,
      amount: createdOrder.finalAmount,
    });

    await payment.save({ session });

    let result;

    if (createdOrder.paymentMethod == "Online") {
      result = await sslService.initPayment({
        total_amount: createdOrder.finalAmount,
        tran_id: transactionId,
      });
      result = { paymentUrl: result };
    } else {
      result = order;
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // const pdfBuffer = await generateOrderInvoicePDF(createdOrder);
    // const emailContent = await EmailHelper.createEmailContent(
    //   //@ts-ignore
    //   { userName: createdOrder.user.name || "" },
    //   "orderInvoice"
    // );

    // const attachment = {
    //   filename: `Invoice_${createdOrder._id}.pdf`,
    //   content: pdfBuffer,
    //   encoding: "base64", // if necessary
    // };

    // await EmailHelper.sendEmail(
    //   //@ts-ignore
    //   createdOrder.user.email,
    //   emailContent,
    //   "Order confirmed!",
    //   attachment
    // );
    return result;
  } catch (error) {
    console.log(error);
    // Rollback the transaction in case of error
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getOrders = async (
  query: Record<string, unknown>,
  authUser: IJwtPayload
) => {
  const user = await User.findById(authUser.userId);

  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found!");

  const orderQuery = new QueryBuilder(Order.find(), query)
    .search(["user.name", "user.email", "products.product.name"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await orderQuery.modelQuery;

  const meta = await orderQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getOrderDetails = async (orderId: string) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not Found");
  }

  order.payment = await Payment.findOne({ order: order._id });
  return order;
};

const getMyOrders = async (
  query: Record<string, unknown>,
  authUser: IJwtPayload
) => {
  const orderQuery = new QueryBuilder(
    Order.find({ user: authUser.userId }),
    query
  )
    .search(["user.name", "user.email", "products.product.name"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await orderQuery.modelQuery;

  const meta = await orderQuery.countTotal();

  return {
    meta,
    result,
  };
};

const changeOrderStatus = async (
  orderId: string,
  status: string,
  authUser: IJwtPayload
) => {
  const userHasShop = await User.findById(authUser.userId);

  const order = await Order.findOneAndUpdate(
    { _id: new Types.ObjectId(orderId) },
    { status },
    { new: true }
  );
  return order;
};

export const OrderService = {
  createOrder,
  getOrders,
  getOrderDetails,
  getMyOrders,
  changeOrderStatus,
};
