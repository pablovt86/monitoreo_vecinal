const fs = require("fs");
const path = require("path");
const https = require("https");

const DATA_URL =
  "https://raw.githubusercontent.com/datosgobar/seguridad-ciudadana/master/delitos/delitos.csv";




  

const RAW_DIR = path.join(__dirname, "../../data/raw");
const OUTPUT_FILE = path.join(RAW_DIR, "delitos.csv");

if (!fs.existsSync(RAW_DIR)) {
  fs.mkdirSync(RAW_DIR, { recursive: true });
}

console.log("📥 Descargando dataset oficial (GitHub)...");

https.get(DATA_URL, (res) => {
  if (res.statusCode !== 200) {
    console.error(`❌ Error al descargar dataset. Status: ${res.statusCode}`);
    return;
  }

  const file = fs.createWriteStream(OUTPUT_FILE);
  res.pipe(file);

  file.on("finish", () => {
    file.close();
    console.log("✅ Dataset descargado correctamente");
    console.log("📁 Guardado en data/raw/delitos.csv");
  });
}).on("error", (err) => {
  console.error("❌ Error de red:", err.message);
});
