const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const {
    getUserProfile,
    updateUserProfile,
    getAllProfiles,
    updateUserStatus,
    getAllDoctorProfiles,
    getPublicDoctorProfile,
} = require("../controllers/profileController"); 

const router = express.Router();

// Public doctor profile route for UI
router.get("/doctor/:id", getPublicDoctorProfile);

// Get profile by ID
router.get("/:id", verifyToken, authorizeRoles("patient", "doctor","admin"), getUserProfile);

// Update profile by ID (supports multipart/form-data with field 'profileImage')
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("patient", "doctor"),
  upload.single("profileImage"),
  updateUserProfile
);

// Removed separate image route; image handled in generic update

// Admin-only: Get all profiles
router.get("/", verifyToken, authorizeRoles("admin"), getAllProfiles);

// Admin-only: Update user status (Active/Inactive)
router.put("/status/:id", verifyToken, authorizeRoles("admin"), updateUserStatus);

// Get all doctor profiles (UI)
router.get("/all/doctors", getAllDoctorProfiles);

module.exports = router;
