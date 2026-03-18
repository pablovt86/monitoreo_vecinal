const streets = [
  "Av. Hipólito Yrigoyen",
  "Av. Alsina",
  "Av. Mitre",
  "Av. Pavón",
  "Av. Calchaquí",
  "Av. Belgrano",
  "Av. San Martín",
  "Av. 9 de Julio",
  "Av. Perón",
  "Av. Larroque"
];

module.exports = {
  async up(queryInterface, Sequelize) {

    const locations = [];

    for (let i = 0; i < 500; i++) {

      const street = streets[Math.floor(Math.random() * streets.length)];

      locations.push({

        address: `${street} ${Math.floor(Math.random() * 4000) + 100}`,

        latitude: -34.78 + (Math.random() * 0.2),

        longitude: -58.45 + (Math.random() * 0.2),

        neighborhood_id: (i % 100) + 1

      });

    }

    await queryInterface.bulkInsert("locations", locations);

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete("locations", null, {});

  }
};