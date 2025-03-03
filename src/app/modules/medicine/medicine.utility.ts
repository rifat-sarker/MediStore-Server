import Medicine from "./medicine.model";



// Function to update stock dynamically whenever quantity is changed
export const updateMedicineStock = async (medicineId: string) => {
  const medicine = await Medicine.findById(medicineId);
  if (!medicine) return;

  const isInStock = (medicine.stock ?? 0) > 0; // Ensure quantity check is safe

  if (medicine.availability !== isInStock) {
    await Medicine.updateOne({ _id: medicineId }, { stock: isInStock });
  }
};
