import { IMedicine } from "./medicine.interface";
import Medicine from "./medicine.model";

const createMedicineIntoDB = async (medicineData: IMedicine) => {
  try {
    const result = await Medicine.create(medicineData);
    return result;
  } catch (error) {
    console.error("Error in createMedineIntoDB:", error);
    throw new Error("Failed to create medicine in DB");
  }
};
export const MedicineServices = {
  createMedicineIntoDB,
};
