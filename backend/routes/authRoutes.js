const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  getAllUsers,
  createUserByAdmin,
  updateUserRole,
  deleteUser,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// ================= PUBLIC =================

// Register normal user
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// ================= ADMIN =================

// Get all users
router.get(
  "/users",
  protect,
  adminMiddleware,
  getAllUsers
);

// Create user
router.post(
  "/users",
  protect,
  adminMiddleware,
  createUserByAdmin
);

// Change role
router.put(
  "/users/:id/role",
  protect,
  adminMiddleware,
  updateUserRole
);

// Delete user
router.delete(
  "/users/:id",
  protect,
  adminMiddleware,
  deleteUser
);

module.exports = router;