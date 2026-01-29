const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config/database/db");

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    ...config,
    dialect: "mysql" 
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;




const User = require("./User")(sequelize, DataTypes);
const IncidentType = require("./IncidentType")(sequelize, DataTypes);
const Location = require("./Location")(sequelize, DataTypes);
const Report = require("./Report")(sequelize, DataTypes);
const ReportImage = require("./ReportImage")(sequelize, DataTypes);
const Alert = require("./Alert")(sequelize, DataTypes);
const ReportStatusHistory = require("./ReportStatusHistory")(sequelize, DataTypes);

/* RELACIONES */
User.hasMany(Report, { foreignKey: "user_id" });
Report.belongsTo(User, { foreignKey: "user_id" });

IncidentType.hasMany(Report, { foreignKey: "incident_type_id" });
Report.belongsTo(IncidentType, { foreignKey: "incident_type_id" });

Location.hasMany(Report, { foreignKey: "location_id" });
Report.belongsTo(Location, { foreignKey: "location_id" });

Report.hasMany(ReportImage, { foreignKey: "report_id" });
ReportImage.belongsTo(Report, { foreignKey: "report_id" });

Report.hasMany(Alert, { foreignKey: "report_id" });
Alert.belongsTo(Report, { foreignKey: "report_id" });

Report.hasMany(ReportStatusHistory, { foreignKey: "report_id" });
ReportStatusHistory.belongsTo(Report, { foreignKey: "report_id" });

User.hasMany(ReportStatusHistory, { foreignKey: "changed_by" });
ReportStatusHistory.belongsTo(User, { foreignKey: "changed_by" });

module.exports = {
  sequelize,
  User,
  IncidentType,
  Location,
  Report,
  ReportImage,
  Alert,
  ReportStatusHistory
};