import { Router } from "express";
import { ReviewControllers } from "./review.controller";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";

const router = Router();

// Public — anyone can read reviews
router.get("/", ReviewControllers.getAllReviews);

// Customers can post reviews
router.post("/", auth(Role.CUSTOMER, Role.ADMIN), ReviewControllers.createReview);

// Customer (own) or Admin can delete
router.delete("/:reviewId", auth(Role.CUSTOMER, Role.ADMIN), ReviewControllers.deleteReview);

export const ReviewRoutes = router;
