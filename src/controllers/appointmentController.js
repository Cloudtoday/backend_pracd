const Appointment = require("../models/appointmentModel");

// ==========================
// Patient: Create Appointment
// ==========================
const createAppointment = async (req, res) => {
  try {
    const { patient_type, user_id, name, phone, email, date, time_slot, doctor_name, doctor_email,doctor_id, fees } = req.body;

    const newAppointment = new Appointment({
      patient_type,
      user_id,
      name,
      phone,
      email,
      date,
      time_slot,
      doctor_id,
      doctor_name,
      doctor_email,
      fees,
    });

    await newAppointment.save();
    res.status(201).json({ message: "Appointment submitted successfully", appointment: newAppointment });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};

// ==========================
// Admin: Get All Appointments
// ==========================
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    if (!appointments.length) return res.status(404).json({ message: "No appointments found" });

    res.status(200).json({ total: appointments.length, appointments });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};

// ==========================
// Admin: Update Appointment Status (Approve / Reject)
// ==========================
const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "approved" or "rejected"

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Use 'approved' or 'rejected'." });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    res.status(200).json({ message: `Appointment ${status} successfully`, appointment });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};

// ==========================
// Patient: Get Appointments by user_id
// ==========================
const getAppointmentsByPatient = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Only allow logged-in patient to see their own appointments
    if (req.user.id !== user_id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const appointments = await Appointment.find({ user_id }).sort({ date: -1 });
    if (!appointments.length) return res.status(404).json({ message: "No appointments found" });

    res.status(200).json({ total: appointments.length, appointments });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};


// ==========================
// Get Appointments by Doctor ID
// ==========================

const getAppointmentsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    // Check that the logged-in doctor matches the route doctorId
    if (req.user.role !== "admin" && req.user.id !== doctorId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const appointments = await Appointment.find({ doctor_id: doctorId })
      .populate("user_id", "username useremail")   // show patient info
      .populate("doctor_id", "username useremail") // show doctor info
      .sort({ date: 1 });

    if (appointments.length === 0) {
      return res.status(404).json({ message: "No appointments found for this doctor" });
    }

    res.status(200).json({
      message: "Appointments fetched successfully",
      appointments,
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};


module.exports = {
  createAppointment,
  getAllAppointments,
  updateAppointmentStatus,
  getAppointmentsByPatient,
  getAppointmentsByDoctor,
};
