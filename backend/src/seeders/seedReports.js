// 🔹 Importamos los modelos de la base
require("dotenv").config({ path: "../.env" });
const {
  Report,
  
  User,
  IncidentType,
  Location
} = require("../models");


// 🔹 Lista de descripciones que usarán los reportes
// Esto hace que los reportes parezcan reales
const descriptions = [
  "Robo de celular en la parada del colectivo",
  "Persona sospechosa merodeando casas",
  "Intento de robo en comercio",
  "Auto sospechoso estacionado hace horas",
  "Moto sin patente circulando",
  "Robo de bicicleta",
  "Discusión violenta en la calle",
  "Intentaron abrir autos estacionados",
  "Grupo sospechoso en la plaza",
  "Ruidos extraños en casa abandonada"
];


// 🔥 FUNCIÓN PRINCIPAL DEL SEED
async function seedReports() {

  try {

    console.log("🚀 Generando reportes fake...");


    // 🔹 Traemos usuarios existentes
    const users = await User.findAll();

    // 🔹 Traemos tipos de incidentes
    const incidents = await IncidentType.findAll();

    // 🔹 Traemos ubicaciones
    const locations = await Location.findAll();


    // 🔹 Array donde guardaremos todos los reportes
    const reports = [];


    // 🔥 Generamos 200 reportes
    for (let i = 0; i < 200; i++) {

      // 🔹 Elegimos usuario random
      const randomUser =
        users[Math.floor(Math.random() * users.length)];

      // 🔹 Elegimos incidente random
      const randomIncident =
        incidents[Math.floor(Math.random() * incidents.length)];

      // 🔹 Elegimos ubicación random
      const randomLocation =
        locations[Math.floor(Math.random() * locations.length)];

      // 🔹 Elegimos descripción random
      const randomDescription =
        descriptions[Math.floor(Math.random() * descriptions.length)];


      // 🔹 Generamos una fecha dentro de las últimas 12 horas
      const date = new Date();
      date.setHours(date.getHours() - Math.floor(Math.random() * 12));


      // 🔹 Armamos el objeto reporte
      reports.push({
        description: randomDescription,
        user_id: randomUser.id,
        incident_type_id: randomIncident.id,
        location_id: randomLocation.id,
        status: "pendiente",
        report_date: date,
        createdAt: new Date(),
        updatedAt: new Date()
      });

    }


    // 🔥 Insertamos todos los reportes en la base
    await Report.bulkCreate(reports);


    console.log("✅ 200 reportes creados correctamente");

    process.exit();

  } catch (error) {

    console.error("❌ Error creando seed:", error);

  }

}


// 🔹 Ejecutamos la función
seedReports();