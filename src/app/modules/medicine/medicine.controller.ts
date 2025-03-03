import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { MedicineServices } from "./medicine.service";

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


export const MedicineController = {
   createMedicine,
};