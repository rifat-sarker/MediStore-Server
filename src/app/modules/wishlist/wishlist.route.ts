import express from "express";
import { WishlistController } from "./wishlist.controller";

const router = express.Router();
router.post("/", WishlistController.addToWishlist);
router.get("/", WishlistController.getWishlist);
router.delete("/:productId", WishlistController.deleteFromWishlist);

export const WishlistRoutes = router;
