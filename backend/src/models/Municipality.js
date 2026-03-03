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
  });

 

  return Municipality;
};