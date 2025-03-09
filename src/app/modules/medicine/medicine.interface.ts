import { Types } from "mongoose";

export interface IMedicine {
  name: string;
  category:Types.ObjectId;
  type:Types.ObjectId;
  brand:string,
  description: string;
  price: number;
  stock: number;
  availability: boolean;
  requiredPrescription: boolean;
  manufacturer: string;
  offerPrice?: number | null;
  expiryDate: Date;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  calculateOfferPrice(): Promise<number | null>;
}
