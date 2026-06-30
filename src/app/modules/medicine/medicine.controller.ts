import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { MedicineServices } from "./medicine.service";

// create medicine — imageUrl comes from req.body (uploaded via /upload first)
const createMedicine = catchAsync(async (req, res) => {
  const result = await MedicineServices.createMedicineIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Medicine created successfully",
    data: result,
  });
});

// get all medicines
const getAllMedicine = catchAsync(async (req, res) => {
  const result = await MedicineServices.getAllMedicineFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Medicines retrieved successfully",
    meta: result.meta,
    data: result.result,
  });
});

// get a single medicine
const getASpecificMedicine = catchAsync(async (req, res) => {
  const { medicineId } = req.params;
  const result = await MedicineServices.getASpecificMedicineFromDB(medicineId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Medicine retrieved successfully",
    data: result,
  });
});

// update medicine
const updateMedicine = catchAsync(async (req, res) => {
  const { medicineId } = req.params;
  const result = await MedicineServices.updateMedicineIntoDB(medicineId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Medicine updated successfully",
    data: result,
  });
});

// delete medicine
const deleteMedicine = catchAsync(async (req, res) => {
  const { medicineId } = req.params;
  await MedicineServices.deleteMedicineFromDB(medicineId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Medicine deleted successfully",
    data: null,
  });
});

export const MedicineController = {
  createMedicine,
  getAllMedicine,
  getASpecificMedicine,
  updateMedicine,
  deleteMedicine,
};