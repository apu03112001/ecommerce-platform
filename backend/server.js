const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const orderRoutes = require("./routes/orderRoutes");

const protect = require("./middleware/authMiddleware");

const app = express();

// ================= DATABASE =================

connectDB();

// ================= CORS =================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://ecommerce-platform-ten-tan.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an origin
      // such as Postman or server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow Vercel preview deployments
      if (
        origin.includes(".vercel.app")
      ) {
        return callback(null, true);
      }

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],

    credentials: false,
  })
);

// ================= BODY PARSER =================

app.use(express.json());

// ================= ROUTES =================

app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/wishlist", wishlistRoutes);

app.use("/api/orders", orderRoutes);

// ================= HOME =================

app.get("/", (req, res) => {
  res.json({
    message:
      "LabuShop backend is running successfully!",
  });
});

// ================= PROFILE =================

app.get(
  "/api/profile",
  protect,
  (req, res) => {
    res.json({
      message:
        "Welcome to your profile!",
      user: req.user,
    });
  }
);

// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});