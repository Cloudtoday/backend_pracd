const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const {
  createAppointment,
  getAllAppointments,
  updateAppointmentStatus,
  getAppointmentsByPatient,
  getAppointmentsByDoctor,
} = require("../controllers/appointmentController");

const router = express.Router();

// Patient: Submit new appointment
router.post("/", verifyToken, authorizeRoles("patient"), createAppointment);

// Admin: Get all appointments
router.get("/", verifyToken, authorizeRoles("admin"), getAllAppointments);

// Admin: Approve / Reject appointment
router.put("/status/:id", verifyToken, authorizeRoles("admin"), updateAppointmentStatus);

// Patient: Get appointment list by user_id
router.get("/patient/:user_id", verifyToken, authorizeRoles("patient"), getAppointmentsByPatient);

router.get("/doctor/:doctorId", verifyToken, authorizeRoles("doctor"), getAppointmentsByDoctor);


module.exports = router;
