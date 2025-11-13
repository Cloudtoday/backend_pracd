const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const {
  submitContact,
  getAllContacts,
} = require("../controllers/contactController");

const router = express.Router();

// 1️⃣ Submit Contact Form — 🟢 Public (no login required)
router.post("/", submitContact);

// 2️⃣ Admin: Get all contact enquiries
router.get("/", verifyToken, authorizeRoles("admin"), getAllContacts);

module.exports = router;
