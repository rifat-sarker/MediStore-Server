import { Router } from "express";
import { CouponController } from "./coupon.controller";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";

const router = Router();

// Customer can validate/apply coupon
router.post("/apply", auth(Role.CUSTOMER, Role.ADMIN), CouponController.applyCoupon);

// Admin routes
router.get("/", auth(Role.ADMIN), CouponController.getAllCoupons);
router.post("/", auth(Role.ADMIN), CouponController.createCoupon);
router.patch("/:id/toggle", auth(Role.ADMIN), CouponController.toggleCoupon);
router.delete("/:id", auth(Role.ADMIN), CouponController.deleteCoupon);

export const CouponRoutes = router;
