module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Report", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    description: DataTypes.TEXT,
    report_date: DataTypes.DATE,
    status: {
      type: DataTypes.ENUM("pendiente", "en_proceso", "resuelto"),
      defaultValue: "pendiente"
    }
  }, {
    tableName: "reports",
    timestamps: true,
    underscored: true
  });
};
