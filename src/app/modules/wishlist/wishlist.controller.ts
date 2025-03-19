import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { WishlistService } from "./wishlist.service";
import httpStatus from "http-status";

const addToWishlist = catchAsync(async (req: Request, res: Response) => {
  console.log("Request Body:", req.body); // Debugging

  const { user, products } = req.body; // Fix here

  if (!user || !products || !products.length) {
    res.status(400).json({
      success: false,
      message: "User ID and at least one Product ID are required",
    });
    return;
  }

  const result = await WishlistService.addToWishlist(user, products);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Added to wishlist successfully",
    data: result,
  });
});

const getWishlist = catchAsync(async (req: Request, res: Response) => {
  const result = await WishlistService.getWishlist();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wishlist retreieved succesfully",
    data: result,
  });
});

const deleteFromWishlist = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params; 
  const result = await WishlistService.deleteFromWishlist( productId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product deleted from wishlist successfully",
    data: result,
  });
});


export const WishlistController = {
  addToWishlist,
  getWishlist,
  deleteFromWishlist,
};
