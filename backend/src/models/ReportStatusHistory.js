module.exports = (sequelize, DataTypes) => {
  return sequelize.define("ReportStatusHistory", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    old_status: DataTypes.STRING,
    new_status: DataTypes.STRING
  }, {
    tableName: "report_status_history",
    timestamps: false
  });
};
