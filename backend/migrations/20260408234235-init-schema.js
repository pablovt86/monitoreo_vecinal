'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    // ROLES
    await queryInterface.createTable('roles', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, unique: true, allowNull: false }
    });

    // USERS
    await queryInterface.createTable('users', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      firstname: Sequelize.STRING,
      lastname: Sequelize.STRING,
      email: { type: Sequelize.STRING, unique: true },
      password: Sequelize.STRING,
      role_id: {
        type: Sequelize.INTEGER,
        defaultValue: 3,
        references: { model: 'roles', key: 'id' }
      },
      phone: Sequelize.STRING,
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE
    });

    // MUNICIPALITIES
    await queryInterface.createTable('Municipalities', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false }
    });

    // NEIGHBORHOODS
    await queryInterface.createTable('neighborhoods', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: Sequelize.STRING,
      municipality_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Municipalities', key: 'id' }
      }
    });

    // LOCATIONS
    await queryInterface.createTable('locations', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      address: Sequelize.STRING,
      neighborhood: Sequelize.STRING,
      latitude: Sequelize.DECIMAL(10, 8),
      longitude: Sequelize.DECIMAL(11, 8),
      neighborhood_id: {
        type: Sequelize.INTEGER,
        references: { model: 'neighborhoods', key: 'id' }
      }
    });

    // INCIDENT TYPES
    await queryInterface.createTable('incident_types', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: Sequelize.STRING,
      description: Sequelize.TEXT,
      severity_level: Sequelize.INTEGER
    });

    // REPORTS
    await queryInterface.createTable('reports', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      description: Sequelize.TEXT,
      report_date: Sequelize.DATE,
      image: Sequelize.STRING,
      status: {
        type: Sequelize.ENUM("pendiente", "en_proceso", "resuelto"),
        defaultValue: "pendiente"
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' }
      },
      incident_type_id: {
        type: Sequelize.INTEGER,
        references: { model: 'incident_types', key: 'id' }
      },
      location_id: {
        type: Sequelize.INTEGER,
        references: { model: 'locations', key: 'id' }
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE
    });

    // REPORT VALIDATIONS
    await queryInterface.createTable('report_validations', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      report_id: {
        type: Sequelize.INTEGER,
        references: { model: 'reports', key: 'id' }
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' }
      },
      vote: {
        type: Sequelize.ENUM("up", "down")
      },
      created_at: Sequelize.DATE
    });

    // COMMENTS
    await queryInterface.createTable('comments', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      content: Sequelize.TEXT,
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' }
      },
      report_id: {
        type: Sequelize.INTEGER,
        references: { model: 'reports', key: 'id' }
      },
      parent_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      }
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('comments');
    await queryInterface.dropTable('report_validations');
    await queryInterface.dropTable('reports');
    await queryInterface.dropTable('incident_types');
    await queryInterface.dropTable('locations');
    await queryInterface.dropTable('neighborhoods');
    await queryInterface.dropTable('Municipalities');
    await queryInterface.dropTable('users');
    await queryInterface.dropTable('roles');
  }
};