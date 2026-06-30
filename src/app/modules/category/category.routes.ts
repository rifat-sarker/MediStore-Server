import { Router } from "express";
import { multerUpload } from "../../config/multer.config";
import { Role } from "@prisma/client";
import { categoryValidation } from "./category.validation";
import validateRequest from "../../middlewares/validateRequest";
import { parseBody } from "../../middlewares/bodyParser";
import { CategoryController } from "./category.controller";
import auth from "../../middlewares/auth";

const router = Router();

router.get("/", CategoryController.getAllCategory);

router.post(
  "/",
  auth(Role.CUSTOMER),
  multerUpload.single("icon"),
  parseBody,
  validateRequest(categoryValidation.createCategoryValidationSchema),
  CategoryController.createCategory
);

router.patch(
  "/:id",
  auth(Role.CUSTOMER),
  multerUpload.single("icon"),
  parseBody,
  validateRequest(categoryValidation.updateCategoryValidationSchema),
  CategoryController.updateCategory
);

router.delete(
  "/:id",
  auth(Role.CUSTOMER),
  CategoryController.deleteCategory
);

export const CategoryRoutes = router;
