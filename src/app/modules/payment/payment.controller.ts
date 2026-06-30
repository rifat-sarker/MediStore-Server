import { Router, Request, Response } from "express";
import prisma from "../../utils/prisma";
import { OrderStatus, PaymentStatus } from "@prisma/client";

const router = Router();

// IPN listener - SSLCommerz calls this to notify payment status
router.post("/ipn", async (req: Request, res: Response) => {
  const { tran_id, status, val_id } = req.body;

  try {
    if (status === "VALID" || status === "VALIDATED") {
      await prisma.order.updateMany({
        where: { transactionId: tran_id },
        data: {
          paymentStatus: PaymentStatus.PAID,
          status: OrderStatus.PROCESSING,
        },
      });
    } else if (status === "FAILED") {
      await prisma.order.updateMany({
        where: { transactionId: tran_id },
        data: { paymentStatus: PaymentStatus.FAILED },
      });
    }

    res.status(200).json({ message: "IPN received" });
  } catch (error) {
    console.error("IPN error:", error);
    res.status(500).json({ message: "IPN processing failed" });
  }
});

// Validate payment by transaction ID (called after redirect)
router.get("/validate/:transactionId", async (req: Request, res: Response) => {
  const { transactionId } = req.params;

  const order = await prisma.order.findFirst({
    where: { transactionId },
    include: { items: { include: { medicine: true } } },
  });

  if (!order) {
    res.status(404).json({ success: false, message: "Order not found" });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Payment validated",
    data: order,
  });
});

export const PaymentRoutes = router;
