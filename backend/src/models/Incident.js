module.exports = (sequelize, DataTypes) => {
  const Incident = sequelize.define(
    "Incident",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      tipo: {
        type: DataTypes.STRING,
        allowNull: false
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      direccion: {
        type: DataTypes.STRING,
        allowNull: false
      },
      estado: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pendiente"
      }
    },
    {
      tableName: "incidents",
      timestamps: true
    }
  );

  return Incident;
};
