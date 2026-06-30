import express from "express";
import { MedicineController } from "./medicine.controller";
import validateRequest from "../../middlewares/validateRequest";
import { MedicineValidation } from "./medicine.validation";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";

const router = express.Router();

/**
 * To add/update a medicine image:
 *   1. POST /api/v1/upload  (multipart) → get imageUrl
 *   2. Pass imageUrl as a string field in this JSON body
 */

// create medicine — JSON only, no form-data
router.post(
  "/",
  auth(Role.ADMIN),
  validateRequest(MedicineValidation.createMedicineValidationSchema),
  MedicineController.createMedicine
);

// get all medicines (public)
router.get("/", MedicineController.getAllMedicine);

// get a single medicine (public)
router.get("/:medicineId", MedicineController.getASpecificMedicine);

// update medicine — JSON only
router.patch(
  "/:medicineId",
  auth(Role.ADMIN),
  validateRequest(MedicineValidation.updateMedicineValidationSchema),
  MedicineController.updateMedicine
);

// delete medicine
router.delete("/:medicineId", auth(Role.ADMIN), MedicineController.deleteMedicine);

export const MedicineRoutes = router;
