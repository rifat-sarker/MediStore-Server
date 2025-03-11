import { Router } from "express";
import { ReviewControllers } from "./review.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.interface";

const router = Router();

router.get("/", auth(USER_ROLE.admin), ReviewControllers.getAllReviews);
router.post("/", auth(USER_ROLE.admin), ReviewControllers.createReview);

export const ReviewRoutes = router;
