const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const wishlistController = require("../controllers/wishlistController");

// Get wishlist
router.get("/", protect, wishlistController.getWishlist);

// Add item to wishlist
router.post("/", protect, wishlistController.addToWishlist);

// Remove item from wishlist
router.delete(
  "/:productId",
  protect,
  wishlistController.removeFromWishlist
);

module.exports = router;