import prisma from "../../utils/prisma";
import { IJwtPayload } from "../auth/auth.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { v4 as uuidv4 } from "uuid";
import { initiateSSLCommerzPayment } from "../payment/payment.service";
import redisClient from "../../utils/redis";
import { OrderStatus, PaymentStatus } from "@prisma/client";

const createOrder = async (orderData: any, authUser: IJwtPayload) => {
  return await prisma.$transaction(async (tx) => {
    let totalAmount = 0;
    const orderItemsData = [];

    if (orderData.products && orderData.products.length > 0) {
      for (const productItem of orderData.products) {
        const product = await tx.medicine.findUnique({
          where: { id: productItem.product },
        });

        if (!product) {
          throw new AppError(
            httpStatus.NOT_FOUND,
            `Product not found: ${productItem.product}`
          );
        }

        if (product.stock < productItem.quantity) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            `Insufficient stock for product: ${product.name}`
          );
        }

        await tx.medicine.update({
          where: { id: product.id },
          data: { stock: product.stock - productItem.quantity },
        });

        const itemTotal = product.price * productItem.quantity;
        totalAmount += itemTotal;

        orderItemsData.push({
          medicineId: product.id,
          quantity: productItem.quantity,
          price: product.price,
        });
      }
    }

    const transactionId = uuidv4();

    const createdOrder = await tx.order.create({
      data: {
        userId: authUser.userId,
        totalAmount,
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        paymentMethod: orderData.paymentMethod || "SSLCOMMERZ",
        transactionId,
        shippingAddress: orderData.shippingAddress || "",
        prescriptionUrl: orderData.prescriptionUrl || null,
        items: {
          create: orderItemsData,
        },
      },
      include: { items: true },
    });

    // Invalidate medicine cache after stock change
    try {
      await redisClient.del("medicines:all");
    } catch {}

    // Initiate SSL Commerz payment if online payment (TEMPORARILY DISABLED AS PER REQUEST)
    /*
    if (
      !orderData.paymentMethod ||
      orderData.paymentMethod === "SSLCOMMERZ"
    ) {
      const user = await tx.user.findUnique({
        where: { id: authUser.userId },
      });

      const sslResponse = await initiateSSLCommerzPayment({
        amount: totalAmount,
        transactionId,
        customerName: user?.name || authUser.name || "Customer",
        customerEmail: authUser.email,
        customerPhone: authUser.phone || user?.phone || "01700000000",
        customerAddress: user?.address || "Dhaka, Bangladesh",
        shippingAddress: orderData.shippingAddress || "Dhaka, Bangladesh",
      });

      return {
        order: createdOrder,
        paymentUrl: sslResponse?.GatewayPageURL || null,
      };
    }
    */

    return { order: createdOrder, paymentUrl: null };
  });
};

const getOrders = async (
  query: Record<string, unknown>,
  authUser: IJwtPayload
) => {
  const { page = 1, limit = 10, status } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const filter: any = {};
  if (status) filter.status = status as OrderStatus;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: filter,
      skip,
      take: Number(limit),
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { medicine: true } },
        rider: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.count({ where: filter }),
  ]);

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPage: Math.ceil(total / Number(limit)),
    },
    result: orders,
  };
};

const getOrderDetails = async (orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      items: { include: { medicine: true } },
      rider: { include: { user: { select: { name: true, phone: true } } } },
    },
  });

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not Found");
  }

  return order;
};

const getMyOrders = async (
  query: Record<string, unknown>,
  authUser: IJwtPayload
) => {
  const { page = 1, limit = 10 } = query;
  const skip = (Number(page) - 1) * Number(limit);
  const filter = { userId: authUser.userId };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: filter,
      skip,
      take: Number(limit),
      include: {
        items: { include: { medicine: true } },
        rider: { include: { user: { select: { name: true, phone: true } } } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.count({ where: filter }),
  ]);

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPage: Math.ceil(total / Number(limit)),
    },
    result: orders,
  };
};

const changeOrderStatus = async (
  orderId: string,
  status: OrderStatus,
  authUser: IJwtPayload
) => {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
  return order;
};

// Admin: verify/reject prescription
const verifyPrescription = async (
  orderId: string,
  action: "approve" | "reject",
  reason?: string
) => {
  const newStatus =
    action === "approve" ? OrderStatus.PROCESSING : OrderStatus.CANCELLED;

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus },
  });

  return order;
};

// Rider: assign and update delivery
const assignRiderToOrder = async (orderId: string, riderId: string) => {
  const riderProfile = await prisma.riderProfile.findUnique({
    where: { id: riderId },
  });

  if (!riderProfile) {
    throw new AppError(httpStatus.NOT_FOUND, "Rider not found");
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      riderId,
      status: OrderStatus.SHIPPED,
    },
  });

  // Mark rider as BUSY
  await prisma.riderProfile.update({
    where: { id: riderId },
    data: { currentStatus: "BUSY" },
  });

  return order;
};

const updateDeliveryStatus = async (
  orderId: string,
  status: OrderStatus,
  authUser: IJwtPayload
) => {
  // Verify rider owns this delivery
  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order) throw new AppError(httpStatus.NOT_FOUND, "Order not found");

  const rider = await prisma.riderProfile.findUnique({
    where: { userId: authUser.userId },
  });

  if (!rider || order.riderId !== rider.id) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not assigned to this delivery"
    );
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  // If delivered, mark rider as AVAILABLE again
  if (status === OrderStatus.DELIVERED) {
    await prisma.riderProfile.update({
      where: { id: rider.id },
      data: { currentStatus: "AVAILABLE" },
    });
  }

  return updatedOrder;
};

const getRiderDeliveries = async (
  query: Record<string, unknown>,
  authUser: IJwtPayload
) => {
  const rider = await prisma.riderProfile.findUnique({
    where: { userId: authUser.userId },
  });

  if (!rider) throw new AppError(httpStatus.NOT_FOUND, "Rider not found");

  const { page = 1, limit = 10, status } = query;
  const skip = (Number(page) - 1) * Number(limit);
  const filter: any = { riderId: rider.id };
  if (status) filter.status = status as OrderStatus;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: filter,
      skip,
      take: Number(limit),
      include: {
        user: { select: { name: true, phone: true, email: true, address: true } },
        items: { include: { medicine: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.count({ where: filter }),
  ]);

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPage: Math.ceil(total / Number(limit)),
    },
    result: orders,
  };
};

export const OrderService = {
  createOrder,
  getOrders,
  getOrderDetails,
  getMyOrders,
  changeOrderStatus,
  verifyPrescription,
  assignRiderToOrder,
  updateDeliveryStatus,
  getRiderDeliveries,
};
