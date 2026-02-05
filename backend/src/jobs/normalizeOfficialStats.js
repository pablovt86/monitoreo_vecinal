// Librerías para archivos
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

// Logger de auditoría para rechazos
const { logRejectedIncident } = require("../utils/auditLogger");

// Rutas
const rawPath = path.join(
  __dirname,
  "../public/dataset_oficiales/snic-pais.csv"
);

const processedPath = path.join(
  __dirname,
  "../../data/processed/incidents_clean.json"
);

// Arrays para control
const valid = [];
const rejected = [];

console.log("🧼 Normalizando estadísticas oficiales (SNIC)...");

fs.createReadStream(rawPath)
  .pipe(csv())
  .on("data", (row) => {
    /**
     * VALIDACIÓN MÍNIMA Y CORRECTA PARA ESTE DATASET
     * No pedimos lat/lng porque NO EXISTEN
     */

    if (!row.anio || !row.codigo_delito_snic_id || !row.codigo_delito_snic_nombre) {
      rejected.push(row);

      logRejectedIncident({
        incident: row,
        reason: "Campos obligatorios faltantes (anio o codigo SNIC)",
        stage: "normalize_official_stats"
      });

      return;
    }  

    /**
     * NORMALIZACIÓN
     * Convertimos todo a tipos consistentes
     */
    valid.push({
      year: Number(row.anio),
      snic_code: Number(row.codigo_delito_snic_id),
      snic_name: row.codigo_delito_snic_nombre.trim(),

      cantidad_hechos: Number(row.cantidad_hechos || 0),
      cantidad_victimas: Number(row.cantidad_victimas || 0),

      tasa_hechos: row.tasa_hechos ? Number(row.tasa_hechos) : null,
      tasa_victimas: row.tasa_victimas ? Number(row.tasa_victimas) : null,

      source: "SNIC",
      dataset_version: "2000-2023"
    });
  })
  .on("end", () => {
    fs.writeFileSync(processedPath, JSON.stringify(valid, null, 2));

    console.log("✅ Normalización completa");
    console.log(`✔️ Registros válidos: ${valid.length}`);
    console.log(
      `❌ Rechazados: ${rejected.length} (${(
        (rejected.length / (valid.length + rejected.length)) *
        100
      ).toFixed(2)}%)`
    );
  });
