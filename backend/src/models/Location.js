module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Location", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    address: DataTypes.STRING,
    neighborhood: DataTypes.STRING,
    latitude: DataTypes.DECIMAL(10,8),
    longitude: DataTypes.DECIMAL(11,8)
  }, {
    tableName: "locations",
    timestamps: false
  });
};
