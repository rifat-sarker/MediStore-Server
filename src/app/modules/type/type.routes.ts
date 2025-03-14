import { Router } from "express";
import { multerUpload } from "../../config/multer.config";
import { TypeController } from "./type.controller";
import { parseBody } from "../../middlewares/bodyParser";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.interface";

const router = Router();

router.get("/", TypeController.getAllType);

router.post(
  "/",
  auth(USER_ROLE.customer),
  multerUpload.single("logo"),
  parseBody,
  TypeController.createType
);

router.patch(
  "/:id",
  auth(USER_ROLE.customer),
  multerUpload.single("logo"),
  parseBody,
  TypeController.updateTypeIntoDB
);

router.delete(
  "/:id",
  auth(USER_ROLE.customer),
  TypeController.deleteTypeIntoDB
);

export const TypeRoutes = router;
