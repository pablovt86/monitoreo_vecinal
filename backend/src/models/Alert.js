module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Alert", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    message: DataTypes.TEXT,
    sent_at: DataTypes.DATE
  }, {
    tableName: "alerts",
    timestamps: false
  });
};
