module.exports = (sequelize, DataTypes) => {

// Modelo que representa estadísticas oficiales agregadas
const OfficialIncidentStat = sequelize.define(
  "OfficialIncidentStat",
  {
    // Año del registro
    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    // Código SNIC del delito
    snic_code: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    // Nombre del delito
    snic_name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    // Cantidad de hechos
    cantidad_hechos: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },

    // Cantidad de víctimas
    cantidad_victimas: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },

    // Tasa de hechos
    tasa_hechos: {
      type: DataTypes.DECIMAL(10, 4)
    },

    // Tasa de víctimas
    tasa_victimas: {
      type: DataTypes.DECIMAL(10, 4)
    },

    // Fuente del dato
    source: {
      type: DataTypes.STRING
    },

    // Versión del dataset
    dataset_version: {
      type: DataTypes.STRING
    },

    // Hash para evitar duplicados
    hash: {
      type: DataTypes.STRING,
      unique: true
    }
  },
  {
    tableName: "official_incident_stats",
    timestamps: false
  }
);

}