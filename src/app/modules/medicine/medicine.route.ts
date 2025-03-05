import express, { NextFunction, Request, Response } from "express";
import { MedicineController } from "./medicine.controller";
import { multerUpload } from "../../config/multer.config";
import validateRequest from "../../middlewares/validateRequest";
import { MedicineValidation } from "./medicine.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "../user/user.interface";

const router = express.Router();

// create medicine
router.post(
  "/",
  // auth(UserRole.admin),
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

// get all medicine
router.get("/", MedicineController.getAllMedicine);

// get a single medicine route
router.get("/:medicineId", MedicineController.getASpecificMedicine);

//update medicine
router.patch(
  "/:medicineId",
  validateRequest(MedicineValidation.updateMedicineValidationSchema),
  MedicineController.updateMedicine
);

// delete a medicine
router.delete("/:medicineId", MedicineController.deleteMedicine);

export const MedicineRoutes = router;
