import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { adminValidations } from "../admin/admin.validation";
import { UserValidation } from "./user.validation";
import { UserControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";

const router = express.Router();

// Register new customer (public)
router.post(
  "/",
  validateRequest(UserValidation.createUserValidationSchema),
  UserControllers.createUser
);

// Admin: create another admin
router.post(
  "/create-admin",
  auth(Role.ADMIN),
  validateRequest(adminValidations.createadminValidationSchema),
  UserControllers.createadmin
);

// Auth: get own profile
router.get("/me", auth(Role.ADMIN, Role.CUSTOMER, Role.RIDER), UserControllers.getMe);

// Admin: get all users
router.get("/", auth(Role.ADMIN), UserControllers.getAllUsers);

// Auth: update own profile (any role)
router.patch(
  "/:userId",
  auth(Role.ADMIN, Role.CUSTOMER, Role.RIDER),
  validateRequest(UserValidation.updateUserValidationSchema),
  UserControllers.updateUser
);

// Admin: delete user
router.delete("/:userId", auth(Role.ADMIN), UserControllers.deleteUser);

export const UserRoutes = router;
