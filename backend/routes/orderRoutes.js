const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  createPaymentOrder,
  verifyPayment,
  placeOrder,
  getOrders,
  getSalesPersonOrders,
  getAllOrders,
  getSalesStats,
} = require("../controllers/orderController");

// ================= PAYMENT =================

router.post(
  "/create-payment-order",
  protect,
  createPaymentOrder
);

router.post(
  "/verify-payment",
  protect,
  verifyPayment
);

// ================= USER =================

router.post(
  "/",
  protect,
  placeOrder
);

router.get(
  "/my",
  protect,
  getOrders
);

// ================= SALES PERSON =================

router.get(
  "/sales-person",
  protect,
  getSalesPersonOrders
);

// ================= ADMIN =================

router.get(
  "/admin/all",
  protect,
  adminMiddleware,
  getAllOrders
);

router.get(
  "/admin/stats",
  protect,
  adminMiddleware,
  getSalesStats
);

module.exports = router;