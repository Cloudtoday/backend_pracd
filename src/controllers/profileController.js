const User = require("../models/userModel");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

// ==========================
// Get Profile by ID (Patient / Doctor / Admin)
// ==========================
const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // Allow self-access; admins can access any profile
    const isSelf = req.user && req.user.id === id;
    const isAdmin = req.user && (req.user.role === "admin" || req.user.isAdmin === true);
    if (!isSelf && !isAdmin) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Validate ObjectId to avoid CastError
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// ==========================
// Update Profile by ID (Patient / Doctor)
// ==========================
const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent unauthorized edits
    if (req.user.id !== id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Validate ObjectId to avoid CastError
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const updateData = req.body || {};
    delete updateData.password; // prevent password updates

    // If an image file is attached, update profileImage (short filename) and cleanup old file
    if (req.file) {
      const existing = await User.findById(id).select("profileImage");
      if (!existing) {
        return res.status(404).json({ message: "User not found" });
      }
      const filename = req.file.filename; // short name only
      if (existing.profileImage) {
        // Support legacy stored values ("/uploads/<name>") and new style ("<name>")
        const legacyName = existing.profileImage.replace(/^\/uploads\//, "");
        const oldAbs = path.join(process.cwd(), "public", "uploads", legacyName);
        try {
          if (fs.existsSync(oldAbs)) fs.unlinkSync(oldAbs);
        } catch (_) {}
      }
      updateData.profileImage = filename;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// ==========================
// Get All Profiles (Admin Only)
// ==========================
const getAllProfiles = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    if (!users.length) {
      return res.status(404).json({ message: "No profiles found" });
    }

    res.status(200).json({ total: users.length, users });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// ==========================
// Update User Status (Admin Only)
// ==========================
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Expect "Active" or "Inactive"

    if (!["Active", "Inactive"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: `User status updated to ${status}`,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// ==========================
// Get All Doctor Profiles (All Roles)
// ==========================

const getAllDoctorProfiles = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("-password");

    if (!doctors.length) {
      return res.status(404).json({ message: "No doctor profiles found" });
    }

    res.status(200).json({
      total: doctors.length,
      doctors,
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};
// Get doctor public profile (no token required)
 const getPublicDoctorProfile = async (req, res) => {
  try {
    const doctorId = req.params.id;

    // Fetch doctor from DB
    const doctor = await User.findById(doctorId).select(
      "username useremail specialization experience doctor_description profileImage status"
    );

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Optional: Ensure only doctors are shown
    if (doctor.role !== "doctor") {
      return res.status(400).json({ message: "Not a doctor profile" });
    }

    res.status(200).json(doctor);
  } catch (error) {
    console.error("Error fetching doctor profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getAllProfiles,
  updateUserStatus,
  getAllDoctorProfiles, 
  getPublicDoctorProfile,
};
