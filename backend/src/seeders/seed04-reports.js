const incidents = [
  "Robo de celular",
  "Robo a mano armada",
  "Intento de robo",
  "Robo de auto",
  "Moto sospechosa",
  "Persona sospechosa",
  "Robo en comercio",
  "Arrebato",
  "Robo de bicicleta",
  "Intento de entradera"
];

module.exports = {
  async up(queryInterface, Sequelize) {

    const reports = [];

    for (let i = 0; i < 1200; i++) {

      const incident = incidents[Math.floor(Math.random() * incidents.length)];

      const date = new Date();
      date.setHours(date.getHours() - Math.floor(Math.random() * 12));

      reports.push({

        description: incident,

        user_id: (i % 50) + 1,

        incident_type_id: (i % 10) + 1,

        location_id: (i % 500) + 1,

        status: "pendiente",

        report_date: date

      });

    }

    await queryInterface.bulkInsert("reports", reports);

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete("reports", null, {});

  }
};