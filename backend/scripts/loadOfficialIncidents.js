require("dotenv").config();
const fs = require("fs");
const csv = require("csv-parser");
const { sequelize, IncidentType, Location, OfficialIncident } = require("../src/models");

const SOURCE_NAME = "GCBA_DATOS_ABIERTOS";

async function run() {
  await sequelize.authenticate();
  console.log("✅ DB conectada");

  const rows = [];

  fs.createReadStream("data/incidentes.csv")
    .pipe(csv())
    .on("data", (row) => rows.push(row))
    .on("end", async () => {
      console.log(`📄 Registros leídos: ${rows.length}`);

      for (const row of rows) {
        // 1. Tipo de incidente
        const [incidentType] = await IncidentType.findOrCreate({
          where: { name: row.tipo_delito }
        });

        // 2. Ubicación
        const [location] = await Location.findOrCreate({
          where: {
            neighborhood: row.barrio
          },
          defaults: {
            address: row.barrio,
            latitude: row.lat,
            longitude: row.lon
          }
        });

        // 3. Inserción incidente oficial
        await OfficialIncident.findOrCreate({
          where: {
            external_id: row.id_registro
          },
          defaults: {
            incident_type_id: incidentType.id,
            location_id: location.id,
            occurred_date: row.fecha,
            source: SOURCE_NAME
          }
        });
      }

      console.log("🚀 Carga finalizada");
      process.exit();
    });
}

run().catch(console.error);
