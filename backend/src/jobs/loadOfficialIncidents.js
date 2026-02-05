// Importamos modelos
const { OfficialIncident } = require("../models");

// Librerías para CSV
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

// Ruta del dataset oficial
const datasetPath = path.join(
  __dirname,
  "../public/dataset_oficiales/snic-pais.csv"
);

console.log("📥 Cargando dataset oficial...");

fs.createReadStream(datasetPath)
  .pipe(csv())
  .on("data", async (row) => {
    // Validación mínima: año y código de delito
    if (!row.nio || !row.codigo_delito_snic_id) return;

    // Evitamos duplicados por año + delito
    const exists = await OfficialIncident.findOne({
      where: {
        year: row.nio,
        snic_code: row.codigo_delito_snic_id
      }
    });

    if (exists) return;

    // Insertamos solo si no existe
    await OfficialIncident.create({
      year: row.nio,
      snic_code: row.codigo_delito_snic_id,
      snic_name: row.codigo_delito_snic_nombre,
      hechos: row.cantidad_hechos || 0,
      victimas: row.cantidad_victimas || 0,
      tasa_hechos: row.tasa_hechos || null,
      source: "SNIC",
      dataset_version: "2024-01"
    });
  })
  .on("end", () => {
    console.log("✅ Dataset oficial cargado correctamente");
  });
