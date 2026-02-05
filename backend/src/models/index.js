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



/* MODELOS */
const Role = require("./Role")(sequelize, DataTypes);
const User = require("./User")(sequelize, DataTypes);
const IncidentType = require("./IncidentType")(sequelize, DataTypes);
const Location = require("./Location")(sequelize, DataTypes);
const Report = require("./Report")(sequelize, DataTypes);
const ReportImage = require("./ReportImage")(sequelize, DataTypes);
const Alert = require("./Alert")(sequelize, DataTypes);
const ReportStatusHistory = require("./ReportStatusHistory")(sequelize, DataTypes);
const AuditLog = require("./AuditLog")(sequelize, DataTypes);
const OfficialIncident = require("./OfficialIncident")(sequelize, DataTypes);
const OfficialIncidentStat = require("./OfficialIncidentStat")(sequelize, DataTypes);
/* RELACIONES */

/* Roles ↔ Users */
Role.hasMany(User, { foreignKey: "role_id" });
User.belongsTo(Role, { foreignKey: "role_id" });

/* Users ↔ Reports */
User.hasMany(Report, { foreignKey: "user_id" });
Report.belongsTo(User, { foreignKey: "user_id" });

/* IncidentTypes ↔ Reports */
IncidentType.hasMany(Report, { foreignKey: "incident_type_id" });
Report.belongsTo(IncidentType, { foreignKey: "incident_type_id" });

/* Locations ↔ Reports */
Location.hasMany(Report, { foreignKey: "location_id" });
Report.belongsTo(Location, { foreignKey: "location_id" });

/* Reports ↔ Images */
Report.hasMany(ReportImage, { foreignKey: "report_id" });
ReportImage.belongsTo(Report, { foreignKey: "report_id" });

/* Reports ↔ Alerts */
Report.hasMany(Alert, { foreignKey: "report_id" });
Alert.belongsTo(Report, { foreignKey: "report_id" });

/* Reports ↔ Status History */
Report.hasMany(ReportStatusHistory, { foreignKey: "report_id" });
ReportStatusHistory.belongsTo(Report, { foreignKey: "report_id" });

/* Users ↔ Status History (quién cambió el estado) */
User.hasMany(ReportStatusHistory, { foreignKey: "changed_by" });
ReportStatusHistory.belongsTo(User, { foreignKey: "changed_by" });

User.hasMany(AuditLog, { foreignKey: "user_id" });
AuditLog.belongsTo(User, { foreignKey: "user_id" });
IncidentType.hasMany(OfficialIncident, {
  foreignKey: "incident_type_id"
});
OfficialIncident.belongsTo(IncidentType, {
  foreignKey: "incident_type_id"
});

IncidentType.hasMany(OfficialIncident, {
  foreignKey: "incident_type_id"
});
OfficialIncident.belongsTo(IncidentType, {
  foreignKey: "incident_type_id"
});

Location.hasMany(OfficialIncident, {
  foreignKey: "location_id"
});
OfficialIncident.belongsTo(Location, {
  foreignKey: "location_id"
});



module.exports = {
  sequelize,
  Role,
  User,
  IncidentType,
  Location,
  Report,
  ReportImage,
  Alert,
  ReportStatusHistory,
  AuditLog,
  OfficialIncident,
  OfficialIncidentStat
};
