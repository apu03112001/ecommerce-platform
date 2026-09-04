const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  getProducts,
  getMyProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Public
router.get("/", getProducts);

// Sales Person / Admin - own products
router.get("/my", protect, getMyProducts);

// Public single product
router.get("/:id", getProductById);

// Create product
router.post(
  "/",
  protect,
  upload.single("image"),
  createProduct
);

// Update product
router.put(
  "/:id",
  protect,
  upload.single("image"),
  updateProduct
);

// Delete product
router.delete(
  "/:id",
  protect,
  deleteProduct
);

module.exports = router;