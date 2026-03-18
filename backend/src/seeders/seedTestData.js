require("dotenv").config({ path: "../.env" });
const { sequelize, Municipality, Neighborhood, Location, Report } = require("../models");

async function seed() {
  try {
    await sequelize.sync();

    // Crear 4 municipios
    const municipalities = await Municipality.bulkCreate([
      { name: "Municipio Norte" },
      { name: "Municipio Sur" },
      { name: "Municipio Este" },
      { name: "Municipio Oeste" },
    ], { returning: true });

    console.log("Municipios creados");

        const neighborhoods = [];

    for (let i = 1; i <= 100; i++) {
      neighborhoods.push({
        name: `Barrio ${i}`,
        municipality_id: municipalities[i % 4].id
      });
    }

    const createdNeighborhoods = await Neighborhood.bulkCreate(neighborhoods, { returning: true });

    console.log("Neighborhoods creados");

        const locations = [];

    for (let i = 1; i <= 100; i++) {
      locations.push({
        address: `Calle Falsa ${i}`,
        latitude: -34.6 + (Math.random() * 0.1),
        longitude: -58.4 + (Math.random() * 0.1),
        neighborhood_id: createdNeighborhoods[i % 100].id
      });
    }

    const createdLocations = await Location.bulkCreate(locations, { returning: true });

    console.log("Locations creadas");


        const reports = [];

    for (let i = 1; i <= 100; i++) {
      reports.push({
        description: `Reporte de prueba ${i}`,
        user_id: 1, // asegurate que exista
        incident_type_id: 1, // asegurate que exista
        location_id: createdLocations[i % 100].id,
        status: "pendiente",
        report_date: new Date()
      });
    }

    await Report.bulkCreate(reports);

    console.log("Reports creados");

    process.exit();
  } catch (error) {
    console.error(error);
  }
}

seed();