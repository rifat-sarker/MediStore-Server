import { Router } from "express";
import { multerUpload } from "../../config/multer.config";
import { USER_ROLE } from "../user/user.interface";
import { categoryValidation } from "./category.validation";
import validateRequest from "../../middlewares/validateRequest";
import { parseBody } from "../../middlewares/bodyParser";
import { CategoryController } from "./category.controller";
import auth from "../../middlewares/auth";

const router = Router();

router.get("/", CategoryController.getAllCategory);

router.post(
  "/",
  auth(USER_ROLE.customer),
  multerUpload.single("icon"),
  parseBody,
  validateRequest(categoryValidation.createCategoryValidationSchema),
  CategoryController.createCategory
);

router.patch(
  "/:id",
  auth(USER_ROLE.customer),
  multerUpload.single("icon"),
  parseBody,
  validateRequest(categoryValidation.updateCategoryValidationSchema),
  CategoryController.updateCategory
);

router.delete(
  "/:id",
  auth(USER_ROLE.customer),
  CategoryController.deleteCategory
);

export const CategoryRoutes = router;
