/**
 * JOB: Importación de incidentes oficiales normalizados
 * Fuente: incidents_clean.json
 * Destino: tabla official_incidents
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const { OfficialIncident } = require("../models");
const { logRejectedIncident } = require("../utils/auditLogger");

// 📌 Ruta del dataset limpio
const dataPath = path.join(
  __dirname,
  "../../data/processed/incidents_clean.json"
);

// 📦 Métricas de ejecución
let inserted = 0;
let duplicated = 0;

// 🔑 Genera un hash único por incidente
// Esto nos permite detectar duplicados incluso si cambian IDs externos
function generateHash(incident) {
  const raw = `${incident.incident_type}|${incident.date}|${incident.latitude}|${incident.longitude}`;
  return crypto.createHash("sha256").update(raw).digest("hex");
}

console.log("📥 Iniciando importación de incidentes oficiales...");

// 🧾 Leemos el archivo limpio
const incidents = JSON.parse(fs.readFileSync(dataPath, "utf8"));

(async () => {
  for (const incident of incidents) {

    // 🔐 Calculamos el hash
    const hash = generateHash(incident);

    // 🔍 Buscamos si ya existe en DB
    const exists = await OfficialIncident.findOne({
      where: { hash }
    });

    if (exists) {
      duplicated++;

      // 📝 Log de duplicado
      logRejectedIncident({
        incident,
        reason: "DUPLICATED_INCIDENT",
        stage: "import_incidents"
      });

      continue;
    }

    // ✅ Insertamos el incidente
    await OfficialIncident.create({
      incident_type: incident.incident_type,
      description: incident.description,
      date: incident.date,
      latitude: incident.latitude,
      longitude: incident.longitude,
      source: incident.source,
      hash
    });

    inserted++;
  }

  console.log("✅ Importación finalizada");
  console.log("📊 Resumen:");
  console.log("Total leídos:", incidents.length);
  console.log("Insertados:", inserted);
  console.log("Duplicados:", duplicated);

  process.exit();
})();
