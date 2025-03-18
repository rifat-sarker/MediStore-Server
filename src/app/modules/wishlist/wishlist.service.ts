import { Types } from "mongoose";
import { Wishlist } from "./wishlist.model";

const addToWishlist = async (user: string, products: string[]) => {
  if (!user || !products || !products.length) {
    throw new Error("User ID and at least one Product ID are required");
  }

  let wishlist = await Wishlist.findOne({ user });

  if (wishlist) {
    const newProducts = products
      .map((id) => new Types.ObjectId(id))
      .filter((id) => !wishlist!.products.includes(id)); // Ensure wishlist exists

    if (newProducts.length > 0) {
      wishlist.products.push(...newProducts);
      await wishlist.save();
    }
  } else {
    wishlist = await Wishlist.create({
      user: new Types.ObjectId(user),
      products: products.map((id) => new Types.ObjectId(id)),
    });
  }

  return wishlist;
};

const deleteFromWishlist = async (user: string, productId: string) => {
  if (!user || !productId) {
    throw new Error("User ID and Product ID are required");
  }

  const wishlist = await Wishlist.findOne({ user });

  if (!wishlist) {
    throw new Error("Wishlist not found");
  }

  const productObjectId = new Types.ObjectId(productId);
  wishlist.products = wishlist.products.filter(
    (id) => !id.equals(productObjectId) // Use `.equals` to compare ObjectIds
  );

  await wishlist.save();

  return wishlist;
};

const getWishlist = async () => {
  const result = await Wishlist.find();
  return result;
};

export const WishlistService = {
  addToWishlist,
  getWishlist,
  deleteFromWishlist,
};
