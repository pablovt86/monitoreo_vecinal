// models/Municipality.js

module.exports = (sequelize, DataTypes) => {
  const Municipality = sequelize.define("Municipality", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {

    tableName: "municipalities",
    timestamps: false
  });

 

  return Municipality;
};