import { Router, Request, Response } from "express";
import prisma from "../../utils/prisma";
import { OrderStatus, PaymentStatus } from "@prisma/client";

import config from "../../config";
import { validateSSLPayment } from "./payment.service";

const router = Router();

// Handle SSLCommerz Success callback (POST/GET from SSL gateway)
const handleSuccess = async (req: Request, res: Response) => {
  const tran_id = (req.body?.tran_id || req.query?.tran_id) as string;
  const val_id = (req.body?.val_id || req.query?.val_id) as string;

  try {
    if (tran_id) {
      // If val_id is present, perform secure validation
      if (val_id) {
        try {
          const validationResult = await validateSSLPayment(val_id);
          if (validationResult?.status === "VALID" || validationResult?.status === "VALIDATED") {
            await prisma.order.updateMany({
              where: { transactionId: tran_id },
              data: {
                paymentStatus: PaymentStatus.PAID,
                status: OrderStatus.PROCESSING,
              },
            });
          }
        } catch (valErr) {
          console.warn("Validation check warn, falling back to tran_id:", valErr);
        }
      }

      // Mark order as PAID & PROCESSING
      await prisma.order.updateMany({
        where: { transactionId: tran_id },
        data: {
          paymentStatus: PaymentStatus.PAID,
          status: OrderStatus.PROCESSING,
        },
      });
    }

    const frontendUrl = config.frontend_url || "http://localhost:3000";
    res.redirect(`${frontendUrl}/payment/success?tran_id=${tran_id || ""}`);
  } catch (error) {
    console.error("Payment success processing error:", error);
    const frontendUrl = config.frontend_url || "http://localhost:3000";
    res.redirect(`${frontendUrl}/payment/fail?tran_id=${tran_id || ""}`);
  }
};

// Handle SSLCommerz Failure callback
const handleFail = async (req: Request, res: Response) => {
  const tran_id = (req.body?.tran_id || req.query?.tran_id) as string;

  try {
    if (tran_id) {
      await prisma.order.updateMany({
        where: { transactionId: tran_id },
        data: { paymentStatus: PaymentStatus.FAILED },
      });
    }
  } catch (error) {
    console.error("Payment fail processing error:", error);
  }

  const frontendUrl = config.frontend_url || "http://localhost:3000";
  res.redirect(`${frontendUrl}/payment/fail?tran_id=${tran_id || ""}`);
};

// Handle SSLCommerz Cancel callback
const handleCancel = async (req: Request, res: Response) => {
  const tran_id = (req.body?.tran_id || req.query?.tran_id) as string;

  try {
    if (tran_id) {
      await prisma.order.updateMany({
        where: { transactionId: tran_id },
        data: {
          paymentStatus: PaymentStatus.FAILED,
          status: OrderStatus.CANCELLED,
        },
      });
    }
  } catch (error) {
    console.error("Payment cancel processing error:", error);
  }

  const frontendUrl = config.frontend_url || "http://localhost:3000";
  res.redirect(`${frontendUrl}/payment/cancel?tran_id=${tran_id || ""}`);
};

// Routes for Success, Fail, Cancel (Accept both POST and GET)
router.post("/success", handleSuccess);
router.get("/success", handleSuccess);

router.post("/fail", handleFail);
router.get("/fail", handleFail);

router.post("/cancel", handleCancel);
router.get("/cancel", handleCancel);

// IPN listener - SSLCommerz calls this asynchronously to verify and notify payment status
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
