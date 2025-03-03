import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { MedicineServices } from "./medicine.service";
import { updateMedicineStock } from "./medicine.utility";

// create medicine
const createMedicine = catchAsync(async (req, res) => {
  const medicineData = req.body; 
  // console.log(medicineData);
  const file = req.file;

  if (!file) {
    throw new Error("Image file is required");
  }

  const result = await MedicineServices.createMedicineIntoDB({
    ...medicineData,
    image: file.path,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Medicine is created successfully",
    data: result,
  });
});

//get all medicine
const getAllMedicine = catchAsync(async (req, res) => {
  const result = await MedicineServices.getAllMedicineFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Medicines retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

// get a single medicine
const getASpecificMedicine = catchAsync(async (req, res) => {
  const { medicineId } = req.params;
  const result = await MedicineServices.getASpecificMedicineFromDB(medicineId);
  res.status(200).json({
    message: 'Get a specific medicine successfully',
    status: true,
    data: result,
  });
});

//  update Medicine
const updateMedicine = catchAsync(async (req, res) => {
  const { medicineId } = req.params;
  const result = await MedicineServices.updateMedicineIntoDB(medicineId, req.body);
  await updateMedicineStock(medicineId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Medicine updated successfully',
    data: result,
  });
});

// delete medicine
const deleteMedicine = catchAsync(async (req, res) => {
  const { medicineId } = req.params;
  await MedicineServices.deleteMedicineFromDB(medicineId);

  res.send({
    message: "Medicine deleted successfully",
    status: true,
    data: {},
  });
});



export const MedicineController = {
  createMedicine,
  getAllMedicine,
  getASpecificMedicine,
  updateMedicine,
  deleteMedicine,
};