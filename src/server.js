const express = require("express");
const dotenv = require("dotenv");
const dbConnect = require("./config/dbConnect");
const authRoutes = require("./routes/authRoutes");
// const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const contactRoutes = require("./routes/contactRoutes");
const cors = require("cors");
dotenv.config();
dbConnect();

const app = express();

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
// Serve uploaded files
app.use("/uploads", express.static("public/uploads"));
//Routes
app.use("/api/auth",authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/contact", contactRoutes);

// Simple health check
app.get('/', (req, res) => {
  res.status(200).json({ ok: true, service: 'backend_pracd' });
});

// Start the server
const PORT = process.env.PORT || 7001;
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});

module.exports = app;
