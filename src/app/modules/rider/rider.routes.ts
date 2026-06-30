import { Router } from "express";
import { RiderController } from "./rider.controller";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";

const router = Router();

router.get("/", auth(Role.ADMIN), RiderController.getAllRiders);
router.get("/available", auth(Role.ADMIN), RiderController.getAvailableRiders);
router.patch("/:id/verify", auth(Role.ADMIN), RiderController.verifyRider);

export const RiderRoutes = router;
