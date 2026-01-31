module.exports = (sequelize, DataTypes) => {
  const OfficialIncident = sequelize.define(
    "OfficialIncident",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      incident_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      location_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      occurred_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      source: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      external_id: {
        type: DataTypes.STRING(100),
        allowNull: true
      }
    },
    {
      tableName: "official_incidents",
      timestamps: false
    }
  );

  return OfficialIncident;
};
