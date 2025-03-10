import { Router } from "express";
import { OrderController } from "./order.controller";
import { USER_ROLE } from "../user/user.interface";
import auth from "../../middlewares/auth";

const router = Router();

// Define routes
router.post("/", OrderController.createOrder);
router.get("/get-orders", OrderController.getOrders);

router.get("/my-orders", OrderController.getMyOrders);

router.get("/:orderId", OrderController.getOrderDetails);

router.patch("/:orderId/status", OrderController.changeOrderStatus);

export const OrderRoutes = router;
