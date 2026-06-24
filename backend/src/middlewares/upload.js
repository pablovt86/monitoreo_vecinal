const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Solo imágenes"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
  fileSize: 20 * 1024 * 1024  }
});

module.exports = upload;