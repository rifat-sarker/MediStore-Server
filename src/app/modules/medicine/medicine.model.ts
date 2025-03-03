import { Schema, model, Document } from "mongoose";
import { IMedicine } from "./medicine.interface";

const MedicineSchema = new Schema<IMedicine>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    requiredPrescription: {
      type: Boolean,
      required: true,
    },
    manufacturer: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Medicine = model<IMedicine>("Medicine", MedicineSchema);

export default Medicine;
