import { Router } from 'express';
import { multerUpload } from '../../config/multer.config';
import { UserRole } from '../user/user.interface';
import { categoryValidation } from './category.validation';
import validateRequest from '../../middlewares/validateRequest';
import { parseBody } from '../../middlewares/bodyParser';
import { CategoryController } from "./category.controller";


const router = Router();

router.get("/", CategoryController.getAllCategory)

router.post(
    '/',
    multerUpload.single('icon'),
    parseBody,
    validateRequest(categoryValidation.createCategoryValidationSchema),
    CategoryController.createCategory
);

router.patch(
    '/:id',
    multerUpload.single('icon'),
    parseBody,
    validateRequest(categoryValidation.updateCategoryValidationSchema),
    CategoryController.updateCategory
)

router.delete(
    '/:id',
    CategoryController.deleteCategory
)

export const CategoryRoutes = router;
