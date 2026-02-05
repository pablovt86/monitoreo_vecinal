module.exports = (sequelize, DataTypes) => {
  const OfficialIncidentStat = sequelize.define(
    "OfficialIncidentStat",
    {
      year: { type: DataTypes.INTEGER, allowNull: false },
      snic_code: { type: DataTypes.INTEGER, allowNull: false },
      snic_name: { type: DataTypes.STRING, allowNull: false },
      cantidad_hechos: { type: DataTypes.INTEGER, defaultValue: 0 },
      cantidad_victimas: { type: DataTypes.INTEGER, defaultValue: 0 },
      tasa_hechos: { type: DataTypes.DECIMAL(10, 4) },
      tasa_victimas: { type: DataTypes.DECIMAL(10, 4) },
      source: { type: DataTypes.STRING },
      dataset_version: { type: DataTypes.STRING },
      hash: { type: DataTypes.STRING, unique: true }
    },
    {
      tableName: "official_incident_stats",
      timestamps: false
    }
  );

  return OfficialIncidentStat; // <--- ESTO ES INDISPENSABLE
};