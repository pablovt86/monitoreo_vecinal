const { Report, IncidentType, Location, sequelize, OfficialIncidentStat } = require("../models");



const { fn, col } = sequelize.Sequelize;

/**
 * KPI 1: Total de reportes
 */
exports.getTotalReports = async (req, res) => {
  try {
    const total = await Report.count();
    res.json({ total_reports: total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo total de reportes" });
  }
};

/**
 * KPI 2: Reportes por estado
 */
exports.getReportsByStatus = async (req, res) => {
  try {
    const data = await Report.findAll({
      attributes: [
        "status",
        [fn("COUNT", col("status")), "total"]
      ],
      group: ["status"]
    });

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo reportes por estado" });
  }
};

/**
 * KPI 3: Reportes por barrio
 */
exports.getReportsByNeighborhood = async (req, res) => {
  try {
    const data = await Report.findAll({
      attributes: [
        [col("Location.neighborhood"), "neighborhood"],
        [fn("COUNT", col("Report.id")), "total"]
      ],
      include: {
        model: Location,
        attributes: []
      },
      group: ["Location.neighborhood"],
      order: [[fn("COUNT", col("Report.id")), "DESC"]]
    });

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo reportes por barrio" });
  }
};

/**
 * KPI 4: Reportes por tipo de incidente
 */
exports.getReportsByIncidentType = async (req, res) => {
  try {
    const data = await Report.findAll({
      attributes: [
        [col("IncidentType.name"), "incident_type"],
        [fn("COUNT", col("Report.id")), "total"]
      ],
      include: {
        model: IncidentType,
        attributes: []
      },
      group: ["IncidentType.name"],
      order: [[fn("COUNT", col("Report.id")), "DESC"]]
    });

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo reportes por tipo" });
  }
};

exports.getTopZones = async (req, res) => {
  try {
    const data = await Report.findAll({
      attributes: [
        [col("Location.neighborhood"), "zone"],
        [fn("COUNT", col("Report.id")), "total"]
      ],
      include: [{
        model: Location,
        attributes: []
      }],
      group: ["Location.neighborhood"],
      order: [[fn("COUNT", col("Report.id")), "DESC"]]
    });

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo zonas" });
  }
};

/**
 * KPI 6: Comparación entre datos oficiales y reportes ciudadanos
 */
exports.getOfficialVsCitizenComparison = async (req, res) => {
  try {

    // 🔹 1️⃣ Obtener cantidad de reportes ciudadanos agrupados por tipo
    const citizenData = await Report.findAll({
      attributes: [
        [col("IncidentType.name"), "incident_type"], // nombre del tipo
        [fn("COUNT", col("Report.id")), "citizen_total"] // total de reportes ciudadanos
      ],
      include: {
        model: IncidentType,
        attributes: []
      },
      group: ["IncidentType.name"]
    });

    // 🔹 2️⃣ Obtener datos oficiales agrupados por tipo (estadísticas oficiales)
    const officialData = await OfficialIncidentStat.findAll({
      attributes: [
        ["snic_name", "incident_type"], // nombre oficial del delito
        [fn("SUM", col("tasa_hechos")), "official_total"] // suma total de hechos oficiales
      ],
      group: ["snic_name"]
    });

    // 🔹 3️⃣ Convertimos resultados a objetos simples (para poder compararlos)
    const citizenMap = {};
    citizenData.forEach(item => {
      citizenMap[item.dataValues.incident_type] = parseInt(item.dataValues.citizen_total);
    });

    const officialMap = {};
    officialData.forEach(item => {
      officialMap[item.dataValues.incident_type] = parseInt(item.dataValues.official_total);
    });

    // 🔹 4️⃣ Unificamos las claves (tipos que existan en cualquiera de los dos)
    const allIncidentTypes = new Set([
      ...Object.keys(citizenMap),
      ...Object.keys(officialMap)
    ]);

    // 🔹 5️⃣ Construimos comparación final
    const comparison = [];

    allIncidentTypes.forEach(type => {
      comparison.push({
        incident_type: type,
        citizen_reports: citizenMap[type] || 0,
        official_reports: officialMap[type] || 0
      });
    });

    // 🔹 6️⃣ Devolvemos resultado
    res.json(comparison);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo comparación oficial vs ciudadano" });
  }
};
 
