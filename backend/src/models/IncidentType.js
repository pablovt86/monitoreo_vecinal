module.exports = (sequelize, DataTypes) => {
  return sequelize.define("IncidentType", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    severity_level: DataTypes.INTEGER
  }, {
    tableName: "incident_types",
    timestamps: false
  });
};
