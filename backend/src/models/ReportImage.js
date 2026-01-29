module.exports = (sequelize, DataTypes) => {
  return sequelize.define("ReportImage", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    image_url: DataTypes.STRING
  }, {
    tableName: "report_images",
    timestamps: false
  });
};
