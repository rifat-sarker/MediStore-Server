import QueryBuilder from "../../builder/QueryBuilder";
import { medicineSearchableFields } from "./medicine.constant";
import { IMedicine } from "./medicine.interface";
import Medicine from "./medicine.model";

const createMedicineIntoDB = async (medicineData: IMedicine) => {
  const result = await Medicine.create(medicineData);
  return result;
};

// const getAllMedicineFromDB = async (query: Record<string, unknown>) => {
//   const medicineQuery = new QueryBuilder(Medicine.find().populate('category').populate('type'), query)
//     .search(medicineSearchableFields)
//     .filter()
//     .sort()
//     .paginate()
//     .fields();
//   const meta = await medicineQuery.countTotal();
//   const result = await medicineQuery.modelQuery;
//   return { meta, result };
// };

const getAllMedicineFromDB = async (query: Record<string, unknown>) => {
  const {
    minPrice,
    maxPrice,
    categories,
    types,
    inStock,
    ratings,
    ...pQuery
  } = query;

  // Build the filter object
  const filter: Record<string, any> = {};

  // Filter by categories
  if (categories) {
    const categoryArray =
      typeof categories === "string"
        ? categories.split(",")
        : Array.isArray(categories)
        ? categories
        : [categories];
    filter.category = { $in: categoryArray };
  }

  // Filter by types
  if (types) {
    const typeArray =
      typeof types === "string"
        ? types.split(",")
        : Array.isArray(types)
        ? types
        : [types];
    filter.brand = { $in: typeArray };
  }

  // Filter by in stock/out of stock
  if (inStock !== undefined) {
    filter.stock = inStock === "true" ? { $gt: 0 } : 0;
  }

  const productQuery = new QueryBuilder(
    Medicine.find(filter)
      .populate("category", "name")
      .populate("type", "name"),
    pQuery
  )
    .search(["name", "description"])
    .filter()
    .sort()
    .paginate()
    .fields()
    .priceRange(Number(minPrice) || 0, Number(maxPrice) || Infinity);

  const products = await productQuery.modelQuery.lean();

  const meta = await productQuery.countTotal();

  return {
    meta,
    result: products,
  };
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
