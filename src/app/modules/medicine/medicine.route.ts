import express, { NextFunction, Request, Response } from "express";
import { MedicineController } from "./medicine.controller";
import { multerUpload } from "../../config/multer.config";
import validateRequest from "../../middlewares/validateRequest";
import { MedicineValidation } from "./medicine.validation";

const router = express.Router();

// create medicine
router.post(
  "/",
  multerUpload.single("file"),
  // upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    console.log("Incoming data: rifat", req.body);
    req.body = JSON.parse(req.body.data);
    // Convert expiryDate to a Date object
    req.body.expiryDate = new Date(req.body.expiryDate);
    console.log("after data: rifat", req.body);

    next();
  },
  validateRequest(MedicineValidation.createMedicineValidationSchema),
  MedicineController.createMedicine
);

export const MedicineRoutes = router;
