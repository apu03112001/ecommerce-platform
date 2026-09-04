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

// ================= ROLE CHECK =================
const sellerAccess = (req, res, next) => {
  if (
    req.user &&
    (
      req.user.role === "admin" ||
      req.user.role === "sales_person"
    )
  ) {
    return next();
  }

  return res.status(403).json({
    message:
      "Only Admin and Sales Person can manage products.",
  });
};

// ================= PUBLIC =================

// Get all products
router.get("/", getProducts);

// Get logged-in user's own products
// IMPORTANT: this must come before /:id
router.get(
  "/my",
  protect,
  getMyProducts
);

// Get one product
router.get("/:id", getProductById);

// ================= ADMIN + SALES PERSON =================

// Create product
router.post(
  "/",
  protect,
  sellerAccess,
  upload.single("image"),
  createProduct
);

// Update product
router.put(
  "/:id",
  protect,
  sellerAccess,
  upload.single("image"),
  updateProduct
);

// Delete product
router.delete(
  "/:id",
  protect,
  sellerAccess,
  deleteProduct
);

module.exports = router;