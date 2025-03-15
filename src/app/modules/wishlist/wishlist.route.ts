import express from "express";
import { WishlistController } from "./wishlist.controller";

const router = express.Router();
router.post("/", WishlistController.addToWishlist);
router.get("/");
router.delete("/:productId");

export const WishlistRoutes = router;
