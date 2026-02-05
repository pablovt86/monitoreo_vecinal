// Librerías nativas
const fs = require("fs");                 // Manejo de archivos
const path = require("path");             // Manejo de rutas

// Ruta del CSV oficial (origen estático)
const sourcePath = path.join(
  __dirname,
  "../public/dataset_oficiales/snic-pais.csv"
);

// Ruta destino RAW (dato crudo, sin tocar)
const rawPath = path.join(
  __dirname,
  "../../data/raw/official_incidents.csv"
);

console.log("📥 Copiando dataset oficial a zona RAW...");

// Copiamos el archivo tal cual viene
fs.copyFileSync(sourcePath, rawPath);

console.log("✅ Dataset copiado correctamente a data/raw");
