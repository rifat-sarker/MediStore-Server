import { Router } from "express";
import { Role } from "@prisma/client";
import { categoryValidation } from "./category.validation";
import validateRequest from "../../middlewares/validateRequest";
import { CategoryController } from "./category.controller";
import auth from "../../middlewares/auth";

const router = Router();

/**
 * To set a category image:
 *   1. POST /api/v1/upload  (multipart) → get imageUrl
 *   2. Pass imageUrl in this JSON body
 */

// Public
router.get("/", CategoryController.getAllCategory);

// Admin only
router.post(
  "/",
  auth(Role.ADMIN),
  validateRequest(categoryValidation.createCategoryValidationSchema),
  CategoryController.createCategory
);

router.patch(
  "/:id",
  auth(Role.ADMIN),
  validateRequest(categoryValidation.updateCategoryValidationSchema),
  CategoryController.updateCategory
);

router.delete("/:id", auth(Role.ADMIN), CategoryController.deleteCategory);

export const CategoryRoutes = router;
