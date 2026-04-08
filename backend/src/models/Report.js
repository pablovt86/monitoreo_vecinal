const {Report} = require("../models");


module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Report", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    description: DataTypes.TEXT,
    report_date: DataTypes.DATE,
    image: {
    type: DataTypes.STRING,
    allowNull: true
   },
    status: {
      type: DataTypes.ENUM("pendiente", "en_proceso", "resuelto"),
      defaultValue: "pendiente"
    }
  }, {
    tableName: "reports",
    timestamps: true,
    underscored: true
  });

  Report.hasMany(models.ReportValidation, {
  foreignKey: "report_id"
});
};
