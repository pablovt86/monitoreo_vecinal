const multer = require("multer");

// 📁 configuración de guardado
const storage = multer.diskStorage({

  // dónde guardar las imágenes
  destination: (req, file, cb) => {
cb(null, path.join(__dirname, '..', 'uploads'));  },

  // nombre del archivo
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }

});

// 🎯 filtro (opcional pero recomendable)
const fileFilter = (req, file, cb) => {

  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Solo imágenes"), false);
  }

};

// 🚀 exportamos multer configurado
const upload = multer({
  storage,
  fileFilter
});

module.exports = upload;