const express = require("express");
const dotenv = require("dotenv");
const dbConnect = require("./config/dbConnect");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const contactRoutes = require("./routes/contactRoutes");
const cors = require("cors");

dotenv.config();
dbConnect();

const app = express();

// ✅ Allow Netlify frontend & local dev for CORS
const allowedOrigins = [
  "https://admirable-pony-f88e19.netlify.app", // your deployed frontend
  "http://localhost:5173", // for local testing
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ CORS blocked for origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static("public/uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/contact", contactRoutes);

// Simple health check
app.get("/", (req, res) => {
  res.status(200).json({ ok: true, service: "backend_pracd" });
});

// Start the server
const PORT = process.env.PORT || 7001;
app.listen(PORT, () => {
  console.log(`✅ Server is running at port ${PORT}`);
});

module.exports = app;
