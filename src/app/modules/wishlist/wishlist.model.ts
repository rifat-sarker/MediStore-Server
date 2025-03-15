import { Schema, model, Document, Types } from "mongoose";
import { IWishlist } from "./wishlist.interface";

// Define the schema
const wishlistSchema = new Schema<IWishlist>(
  {
    _id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Wishlist = model<IWishlist>("Wishlist", wishlistSchema);
