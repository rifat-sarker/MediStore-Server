import { Wishlist } from "./wishlist.model";

const addToWishlist = async (productId: string) => {
  const result = await Wishlist.create({ _id: productId });
  return result;
};

export const WishlistService = {
  addToWishlist,
};
