import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AdminValidations } from "../admin/admin.validation";
import { UserValidation } from "./user.validation";
import { UserControllers } from "./user.controller";

const router = express.Router();
router.post(
  "/create-user",
  validateRequest(UserValidation.createUserValidationSchema),
  UserControllers.createUser
);
router.get("/", UserControllers.getAllUsers);
router.post(
  "/create-admin",
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
