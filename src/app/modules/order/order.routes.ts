import { Router } from "express";
import { OrderController } from "./order.controller";
import { Role } from "@prisma/client";
import auth from "../../middlewares/auth";

const router = Router();

// Customer routes
router.post("/", auth(Role.CUSTOMER, Role.ADMIN), OrderController.createOrder);
router.get("/my-orders", auth(Role.CUSTOMER), OrderController.getMyOrders);

// Admin routes
router.get("/get-orders", auth(Role.ADMIN), OrderController.getOrders);
router.patch("/:orderId/verify", auth(Role.ADMIN), OrderController.verifyPrescription);
router.patch("/:orderId/assign-rider", auth(Role.ADMIN), OrderController.assignRider);

// Rider routes
router.get("/rider/deliveries", auth(Role.RIDER), OrderController.getRiderDeliveries);
router.patch("/:orderId/delivery-status", auth(Role.RIDER), OrderController.updateDeliveryStatus);

// Shared
router.get("/:orderId", auth(Role.CUSTOMER, Role.ADMIN, Role.RIDER), OrderController.getOrderDetails);
router.patch("/:orderId/status", auth(Role.ADMIN), OrderController.changeOrderStatus);

export const OrderRoutes = router;
