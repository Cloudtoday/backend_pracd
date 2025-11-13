const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    // Who the appointment is for
    patient_type: {
      type: String,
      required: [true, "Patient type is required"], // e.g., "Myself" or "Someone Else"
      enum: ["myself", "someoneelse"],
    },
    doctor_id: {
      type: String,
      required: [true, "Doctor id type is required"]
    },
    // Patient reference
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"], // references the patient/user who booked
    },

    // Patient details
    name: {
      type: String,
      required: [true, "Patient name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },

    // Appointment schedule
    date: {
      type: Date,
      required: [true, "Appointment date is required"],
    },
    time_slot: {
      type: String,
      required: [true, "Time slot is required"],
      trim: true,
    },

    // Doctor details
    doctor_name: {
      type: String,
      required: [true, "Doctor name is required"],
      trim: true,
    },
    doctor_email: {
      type: String,
      required: [true, "Doctor email is required"],
      trim: true,
      lowercase: true,
    },
    fees: {
      type: Number,
      required: [true, "Doctor fees are required"],
    },

    // Appointment status (optional)
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("Appointment", appointmentSchema, "appointments");
console.log("Appointment schema is working");
