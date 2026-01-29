module.exports = (sequelize, DataTypes) => {
  return sequelize.define("User", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM("vecino", "admin", "operador"),
      defaultValue: "vecino"
    },
    phone: DataTypes.STRING,
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    tableName: "users",
    timestamps: true,
    underscored: true
  });
};
