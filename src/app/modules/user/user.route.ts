import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { adminValidations } from "../admin/admin.validation";
import { UserValidation } from "./user.validation";
import { UserControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.interface";

const router = express.Router();
router.post(
  "/",
  validateRequest(UserValidation.createUserValidationSchema),
  UserControllers.createUser
);
router.get("/", UserControllers.getAllUsers);
router.post(
  "/create-admin",
  auth(USER_ROLE.admin),
  validateRequest(adminValidations.createadminValidationSchema),
  UserControllers.createadmin
);

router.patch(
  "/:userId",
  validateRequest(UserValidation.updateUserValidationSchema),
  UserControllers.updateUser
);

router.delete("/:userId", UserControllers.deleteUser);

export const UserRoutes = router;
