/**
 * JOB: Normalización de incidentes oficiales
 * Objetivo:
 * - limpiar datos crudos
 * - validar estructura y formato
 * - generar dataset confiable para análisis
 */

const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { logRejectedIncident } = require("../utils/auditLogger");

// 📌 Rutas de entrada y salida
const rawPath = path.join(__dirname, "../../data/raw/official_incidents.csv");
const processedPath = path.join(
  __dirname,
  "../../data/processed/incidents_clean.json"
);

// 📦 Contenedores de resultados
const validIncidents = [];
const rejectedIncidents = [];

/**
 * Validación completa de un incidente
 * Devuelve:
 * - { valid: true }
 * - { valid: false, reason: "MOTIVO" }
 */
function isValidIncident(incident) {
  if (!incident || typeof incident !== "object") {
    return { valid: false, reason: "INVALID_STRUCTURE" };
  }

  const {
    incident_id,
    incident_type,
    date,
    latitude,
    longitude
  } = incident;

  if (!incident_id) {
    return { valid: false, reason: "MISSING_INCIDENT_ID" };
  }

  if (!incident_type || typeof incident_type !== "string") {
    return { valid: false, reason: "INVALID_INCIDENT_TYPE" };
  }

  if (!date || isNaN(Date.parse(date))) {
    return { valid: false, reason: "INVALID_DATE" };
  }

  if (
    typeof latitude !== "number" ||
    latitude < -90 ||
    latitude > 90
  ) {
    return { valid: false, reason: "INVALID_LATITUDE" };
  }

  if (
    typeof longitude !== "number" ||
    longitude < -180 ||
    longitude > 180
  ) {
    return { valid: false, reason: "INVALID_LONGITUDE" };
  }

  return { valid: true };
}

console.log("🧼 Iniciando normalización de incidentes...");

fs.createReadStream(rawPath)
  .pipe(csv())
  .on("data", (row) => {

    // 🔄 Normalización básica de tipos
    const incident = {
      incident_id: row.incident_id || row.id || null,
      incident_type: row.incident_type
        ? row.incident_type.trim().toLowerCase()
        : null,
      description: row.description || "sin descripción",
      date: row.date || null,
      latitude: row.latitude ? parseFloat(row.latitude) : null,
      longitude: row.longitude ? parseFloat(row.longitude) : null,
      source: "oficial"
    };

    // ✅ Validamos la fila
    const validation = isValidIncident(incident);

    if (validation.valid) {
      validIncidents.push(incident);
    } else {
      rejectedIncidents.push(incident);

      // 📝 Log de rechazo (auditoría)
      logRejectedIncident({
        incident,
        reason: validation.reason,
        stage: "normalize_incidents"
      });
    }
  })
  .on("end", () => {
    // 💾 Guardamos solo los datos limpios
    fs.writeFileSync(
      processedPath,
      JSON.stringify(validIncidents, null, 2)
    );

    // 📊 Métricas finales
    const total = validIncidents.length + rejectedIncidents.length;
    const rejectedPct = total
      ? ((rejectedIncidents.length / total) * 100).toFixed(2)
      : 0;

    console.log("✅ Normalización finalizada");
    console.log("📊 Resumen:");
    console.log("Total procesados:", total);
    console.log("Válidos:", validIncidents.length);
    console.log("Rechazados:", rejectedIncidents.length);
    console.log("Rechazados %:", rejectedPct + "%");
  });
