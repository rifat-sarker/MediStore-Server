import { Router } from "express";
import { ReviewControllers } from "./review.controller";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";

const router = Router();

router.get("/", 
    auth(Role.CUSTOMER),
     ReviewControllers.getAllReviews);
router.post("/", 
    auth(Role.CUSTOMER),
 ReviewControllers.createReview);

export const ReviewRoutes = router;
