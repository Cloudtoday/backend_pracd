const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists inside public/uploads
const uploadDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage: short filename with timestamp, keep original ext
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const unique = Date.now().toString(36);
    // very short, predictable prefix
    cb(null, `pfp-${unique}${ext}`);
  },
});

// Accept only image mime types
function imageFilter(req, file, cb) {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowed.includes(file.mimetype)) return cb(null, true);
  cb(new Error("Only JPEG/PNG/WEBP images are allowed"));
}

const upload = multer({
  storage,
  fileFilter: imageFilter,
});

module.exports = upload;
