import { Router } from "express";
import { multerUpload } from "../../config/multer.config";
import { TypeController } from "./type.controller";
import { parseBody } from "../../middlewares/bodyParser";

const router = Router();

router.get("/", TypeController.getAllType);

router.post(
  "/",
  multerUpload.single("logo"),
  parseBody,
  TypeController.createType
);

router.patch(
  "/:id",
  multerUpload.single("logo"),
  parseBody,
  TypeController.updateTypeIntoDB
);

router.delete("/:id", TypeController.deleteTypeIntoDB);

export const TypeRoutes = router;
