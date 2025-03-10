import { Schema, model } from "mongoose";
import { IType } from "./type.interface";

const typeSchema = new Schema<IType>(
  {
    name: {
      type: String,
      required: [true, "Type name is required"],
      unique: true,
      trim: true,
    },
    logo: {
      type: String,
      required: [true, "Type logo URL is required"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category", // Linking to the Category model
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Type = model<IType>("Type", typeSchema);
