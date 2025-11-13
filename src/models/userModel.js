const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "User name is required"],
    },
    useremail: {
      type: String,
      required: [true, "User email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "User password is required"],
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "patient", "doctor"],
    },

    // Optional fields
    age: {
      type: Number,
    },
    address: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    specialization: {
      type: String,
      trim: true,
    },
    // Public URL or path to doctor's profile image
    profileImage: {
      type: String,
      trim: true,
    },
    // Doctor's years of experience (optional)
    experience: {
      type: Number,
      min: 0,
    },
    doctor_description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    fees: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema, "users");
console.log("Mongo schema is working");
