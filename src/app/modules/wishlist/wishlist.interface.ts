import { Types } from "mongoose";

export interface IWishlist extends Document {
  user: Types.ObjectId;
  products: Types.ObjectId[];
}
