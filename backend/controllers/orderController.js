const dotenv = require("dotenv");
dotenv.config();

const Razorpay = require("razorpay");
const crypto = require("crypto");

const Order = require("../models/Order");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ================= CREATE RAZORPAY ORDER =================
const createPaymentOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({
        message: "Amount is required.",
      });
    }

    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json(order);
  } catch (error) {
    console.error("RAZORPAY CREATE ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= VERIFY PAYMENT =================
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        razorpay_order_id + "|" + razorpay_payment_id
      )
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        message: "Payment verification failed.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully.",
    });
  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= PLACE ORDER =================
const placeOrder = async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      paymentId,
      orderId,
    } = req.body;

    const order = await Order.create({
      user: req.user.id,
      items,
      totalAmount,
      paymentId,
      orderId,
    });

    res.status(201).json({
      message: "Order placed successfully!",
      order,
    });
  } catch (error) {
    console.error("PLACE ORDER ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= USER ORDER HISTORY =================
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error("GET USER ORDERS ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= SALES PERSON ORDERS =================
const getSalesPersonOrders = async (req, res) => {
  try {
    const Product = require("../models/Product");

    const myProducts = await Product.find({
      createdBy: req.user.id,
    }).select("_id name");

    const myProductIds = myProducts.map((product) =>
      product._id.toString()
    );

    const allOrders = await Order.find()
      .sort({ createdAt: -1 })
      .lean();

    const matchingOrders = [];

    for (const order of allOrders) {
      const matchingItems = (order.items || []).filter(
        (item) => {
          const productId =
            item.product ||
            item.productId ||
            item._id;

          if (!productId) {
            return false;
          }

          return myProductIds.includes(
            productId.toString()
          );
        }
      );

      if (matchingItems.length > 0) {
        matchingOrders.push({
          ...order,
          items: matchingItems,
        });
      }
    }

    res.status(200).json(matchingOrders);
  } catch (error) {
    console.error(
      "SALES PERSON ORDERS ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= ADMIN: ALL ORDERS =================
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(orders);
  } catch (error) {
    console.error("GET ALL ORDERS ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= ADMIN: SALES STATS =================
const getSalesStats = async (req, res) => {
  try {
    const orders = await Order.find();

    const totalOrders = orders.length;

    const totalSales = orders.reduce(
      (sum, order) =>
        sum + Number(order.totalAmount || 0),
      0
    );

    let totalItems = 0;

    orders.forEach((order) => {
      if (Array.isArray(order.items)) {
        order.items.forEach((item) => {
          totalItems += Number(item.quantity || 0);
        });
      }
    });

    res.status(200).json({
      totalOrders,
      totalSales,
      totalItems,
    });
  } catch (error) {
    console.error("SALES STATS ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
  placeOrder,
  getOrders,
  getSalesPersonOrders,
  getAllOrders,
  getSalesStats,
};