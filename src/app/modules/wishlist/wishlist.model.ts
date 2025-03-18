import { Schema, model, Document, Types } from "mongoose";
import { IWishlist } from "./wishlist.interface";

// Define the schema
const wishlistSchema = new Schema<IWishlist>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Medicine",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Wishlist = model<IWishlist>("Wishlist", wishlistSchema);
