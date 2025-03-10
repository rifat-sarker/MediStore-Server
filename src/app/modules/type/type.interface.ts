import { Document, Types } from "mongoose";

export interface IType extends Document {
  name: string;
  logo: string;
  isActive: boolean;
  createdBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}