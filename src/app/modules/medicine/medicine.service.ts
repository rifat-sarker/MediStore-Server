import QueryBuilder from "../../builder/QueryBuilder";
import { medicineSearchableFields } from "./medicine.constant";
import { IMedicine } from "./medicine.interface";
import Medicine from "./medicine.model";

const createMedicineIntoDB = async (medicineData: IMedicine) => {
  const result = await Medicine.create(medicineData);
  return result;
};

const getAllMedicineFromDB = async (query: Record<string, unknown>) => {
  const medicineQuery = new QueryBuilder(Medicine.find().populate('category').populate('type'), query)
    .search(medicineSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const meta = await medicineQuery.countTotal();
  const result = await medicineQuery.modelQuery;
  return { meta, result };
};

const getASpecificMedicineFromDB = async (_id: string) => {
  const result = await Medicine.findOne({ _id });
  return result;
};

const updateMedicineIntoDB = async (
  _id: string,
  payload: Partial<IMedicine>
) => {
  const result = await Medicine.findByIdAndUpdate(_id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteMedicineFromDB = async (_id: string) => {
  const result = await Medicine.findByIdAndDelete(_id);
  return result;
};

export const MedicineServices = {
  createMedicineIntoDB,
  getAllMedicineFromDB,
  getASpecificMedicineFromDB,
  updateMedicineIntoDB,
  deleteMedicineFromDB,
};
