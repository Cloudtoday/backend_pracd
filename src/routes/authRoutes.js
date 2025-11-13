const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");

const {
  register,
  login,
  adminRegister,
  adminLogin,
  logout,
} = require("../controllers/authController");

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Admin login (✅ must be public — admin needs to log in to get token)
router.post("/admin/login", adminLogin);

// Logout (protected)
router.post("/logout", verifyToken, logout);

module.exports = router;
