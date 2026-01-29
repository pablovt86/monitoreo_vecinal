const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config/database/db");

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    ...config,
    dialect: "mysql" // 👈 CLAVE
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// 👇 ACÁ ESTABA FALTANDO ESTO
db.Report = require("./Report")(sequelize, DataTypes);

// (después agregás los otros modelos)
module.exports = db;
