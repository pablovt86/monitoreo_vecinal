const multer = require("multer");
const path = require("path"); // ✅ Agregado: necesario para armar la ruta
const fs = require("fs");     // ✅ Agregado: necesario para crear la carpeta

// 🌟 MAGIA PARA RENDER: Definimos la ruta y la creamos si no existe
const uploadDir = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 📁 configuración de guardado
const storage = multer.diskStorage({

  // dónde guardar las imágenes
  destination: (req, file, cb) => {
    // Usamos la variable que ya verificamos/creamos arriba
    cb(null, uploadDir);  
  },

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