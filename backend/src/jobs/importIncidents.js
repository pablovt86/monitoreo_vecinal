// Importamos el modelo correcto
const { OfficialIncidentStat } = require("../models");

// Librerías
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Ruta del archivo normalizado
const processedPath = path.join(
  __dirname,
  "../../data/processed/incidents_clean.json"
);

console.log("📥 Importando estadísticas oficiales...");

// Leemos el JSON limpio
const data = JSON.parse(fs.readFileSync(processedPath, "utf-8"));

(async () => {
  let inserted = 0;
  let skipped = 0;

  for (const item of data) {
    // Creamos un hash único por año + delito + fuente
    const hash = crypto
      .createHash("sha256")
      .update(`${item.year}-${item.snic_code}-${item.source}`)
      .digest("hex");

    // Verificamos duplicado
    const exists = await OfficialIncidentStat.findOne({ where: { hash } });
    if (exists) {
      skipped++;
      continue;
    }

    // Insertamos el registro
    await OfficialIncidentStat.create({
      year: item.year,
      snic_code: item.snic_code,
      snic_name: item.snic_name,
      cantidad_hechos: item.cantidad_hechos,
      cantidad_victimas: item.cantidad_victimas,
      tasa_hechos: item.tasa_hechos,
      tasa_victimas: item.tasa_victimas,
      source: item.source,
      dataset_version: item.dataset_version,
      hash
    });

    inserted++;
  }

  console.log(`✅ Insertados: ${inserted}`);
  console.log(`⏭️ Duplicados ignorados: ${skipped}`);
})();
