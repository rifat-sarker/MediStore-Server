import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AdminValidations } from "../admin/admin.validation";
import { UserValidation } from "./user.validation";
import { UserControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "./user.interface";

const router = express.Router();
router.post(
  "/create-user",
  validateRequest(UserValidation.createUserValidationSchema),
  UserControllers.createUser
);
router.get("/", UserControllers.getAllUsers);
router.post(
  "/create-admin",
  auth(UserRole.admin),
  validateRequest(AdminValidations.createAdminValidationSchema),
  UserControllers.createAdmin
);

router.patch(
  "/:userId",
  validateRequest(UserValidation.updateUserValidationSchema),
  UserControllers.updateUser
);

router.delete("/:userId", UserControllers.deleteUser);

export const UserRoutes = router;
