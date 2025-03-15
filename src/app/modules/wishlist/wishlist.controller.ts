import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { WishlistService } from "./wishlist.service";
import httpStatus from "http-status";

const addToWishlist = catchAsync(async (req: Request, res: Response) => {
  const result = await WishlistService.addToWishlist(req.body.productId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Add to wishlist succesfully",
    data: result,
  });
});

export const WishlistController = {
  addToWishlist,
};
