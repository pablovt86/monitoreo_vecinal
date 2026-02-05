const { Report, IncidentType, Location, sequelize } = require("../models");



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

