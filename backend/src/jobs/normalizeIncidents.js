// Logger de auditoría (rechazos)
const { logRejectedIncident } = require("../utils/auditLogger");

// Librerías
const fs = require("fs");                  // Archivos
const path = require("path");              // Rutas
const csv = require("csv-parser");          // CSV → objeto JS
const crypto = require("crypto");           // Hash para duplicados

// Rutas de entrada y salida
const rawPath = path.join(
  __dirname,
  "../../data/raw/official_incidents.csv"
);

const processedPath = path.join(
  __dirname,
  "../../data/processed/incidents_clean.json"
);

// Arrays de control
const validIncidents = [];     // Datos que pasan validación
const rejectedIncidents = [];  // Datos rechazados

console.log("🧼 Normalizando dataset oficial...");

function isValidIncident(row) {
  // Validamos campos obligatorios
  if (!row.nio) return false;
  if (!row.codigo_delito_snic_id) return false;
  if (!row.codigo_delito_snic_nombre) return false;

  // Validamos tipos numéricos
  if (isNaN(Number(row.nio))) return false;
  if (isNaN(Number(row.codigo_delito_snic_id))) return false;

  return true;
}

fs.createReadStream(rawPath)
  .pipe(csv())
  .on("data", (row) => {

    // Validamos estructura y tipos
    if (!isValidIncident(row)) {
      rejectedIncidents.push(row);

      // Log de auditoría
      logRejectedIncident({
        incident: row,
        reason: "Estructura inválida o tipos incorrectos",
        stage: "normalize_official_incidents"
      });

      return; // cortamos esta fila
    }

        // Generamos hash para detectar duplicados futuros
    const hash = crypto
      .createHash("sha256")
      .update(`${row.nio}-${row.codigo_delito_snic_id}`)
      .digest("hex");

    // Armamos el objeto limpio y consistente
    validIncidents.push({
      year: Number(row.nio),
      snic_code: Number(row.codigo_delito_snic_id),
      snic_name: row.codigo_delito_snic_nombre.trim(),
      hechos: Number(row.cantidad_hechos) || 0,
      victimas: Number(row.cantidad_victimas) || 0,
      tasa_hechos: row.tasa_hechos
        ? Number(row.tasa_hechos)
        : null,
      source: "SNIC",
      dataset_version: "static-2024",
      hash
    });
  })

    .on("end", () => {

    // Guardamos dataset limpio
    fs.writeFileSync(
      processedPath,
      JSON.stringify(validIncidents, null, 2)
    );

    // Métricas del ETL
    const total = validIncidents.length + rejectedIncidents.length;
    const rejectedPct = ((rejectedIncidents.length / total) * 100).toFixed(2);

    console.log("✅ Normalización completa");
    console.log(`✔️ Registros válidos: ${validIncidents.length}`);
    console.log(`❌ Rechazados: ${rejectedIncidents.length} (${rejectedPct}%)`);
  });
