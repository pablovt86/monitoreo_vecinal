// =============================
// CONTROLLERS DE REPORTES
// =============================

// Importamos todos los modelos que necesitamos
const {
  Report,
  User,
  IncidentType,
  Location,
  sequelize,
  Neighborhood,
  Municipality,
  ReportValidation
} = require("../models");

// Importamos operadores de Sequelize (para filtros de fechas)
const { Op, fn, col, where } = require("sequelize");
// =============================
// CREAR REPORTE
// =============================
exports.createReport = async (req, res) => {
  try {
    const user_id = req.user?.id;

    if (!user_id) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

   const { incident_type_id, description, latitude, longitude, address } = req.body;
   if (!address) {
  return res.status(400).json({ error: "Falta la dirección (address)" });
}

    // Validaciones básicas
    if (!description || !incident_type_id) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }
    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Faltan coordenadas" });
    }

    // Validar tipo de incidente
    const incidentType = await IncidentType.findByPk(incident_type_id);
    if (!incidentType) {
      return res.status(400).json({ error: "Tipo de incidente inexistente" });
    }

    // Crear o buscar location
    let location = await Location.findOne({
      where: { latitude, longitude }
    });
    if (!location) {
  location = await Location.create({
    latitude,
    longitude,
    address
  });
}

    // Imagen
    const image = req.file ? req.file.filename : null;

    // Crear reporte
    const report = await Report.create({
      description,
      user_id,
      incident_type_id,
      location_id: location.id,
      image,
      status: "pendiente",
      report_date: new Date()
    });

    res.status(201).json(report);
  } catch (error) {
    console.error("ERROR BACKEND:", error);
    res.status(500).json({ error: "Error creando reporte", detalle: error.message });
  }
};

// =============================
// TRAER TODOS LOS REPORTES
// =============================


// =============================
// TRAER REPORTES (CON FILTRO)
// =============================
exports.getReports = async (req, res) => {
  try {

    const { municipio } = req.query;

    const reports = await Report.findAll({
      include: [
        { model: User },
        { model: IncidentType },
        {
          model: Location,
          include: [
            {
              model: Neighborhood,
              include: [
                {
                  model: Municipality,
                  // 🔥 SOLO FILTRAR SI VIENE QUERY
                  ...(municipio && {
                    where: where(
                      fn("LOWER", col("Location.Neighborhood.Municipality.name")),
                      municipio.toLowerCase()
                    )
                  })
                }
              ]
            }
          ]
        }
      ],
      order: [["report_date", "DESC"]]
    });

    const baseUrl = "https://monitoreo-vecinal-backend.onrender.com/api";

    const reportsFormatted = reports.map(report => ({
      ...report.toJSON(),
      image: report.image ? `${baseUrl}/uploads/${report.image}` : null,
      municipio: report.Location?.Neighborhood?.Municipality?.name || "Sin municipio"
    }));

    res.json(reportsFormatted);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener reportes" });
  }
};
// =============================
// TRAER UN REPORTE POR ID
// =============================
exports.getReportById = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findByPk(id, {
      include: [
        { model: User },
        { model: IncidentType },
        {
          model: Location,
          include: [
            {
              model: Neighborhood,
              include: [{ model: Municipality }]
            }
          ]
        }
      ]
    });

    if (!report) {
      return res.status(404).json({ error: "Reporte no encontrado" });
    }

    const baseUrl = "https://monitoreo-vecinal-backend.onrender.com/api";

    const reportFormatted = {
      ...report.toJSON(),
      image: report.image ? `${baseUrl}/uploads/${report.image}` : null,
      municipio: report.Location?.Neighborhood?.Municipality?.name || "Sin municipio"
    };

    res.json(reportFormatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el reporte" });
  }
};

// =============================
// ACTUALIZAR ESTADO DEL REPORTE
// =============================
exports.updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const report = await Report.findByPk(id);
    if (!report) return res.status(404).json({ error: "Reporte no encontrado" });

    report.status = status;
    await report.save();

    res.json({ message: "Estado actualizado", report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error actualizando estado" });
  }
};

// =============================
// RANKING DE MUNICIPIOS
// =============================
exports.getRankingByMunicipality = async (req, res) => {
  try {
    const ranking = await Report.findAll({
      attributes: [
        [sequelize.col("Location.Neighborhood.Municipality.name"), "municipio"],
        [sequelize.fn("COUNT", sequelize.col("Report.id")), "total"]
      ],
      include: [
        {
          model: Location,
          attributes: [],
          include: [
            { model: Neighborhood, attributes: [], include: [{ model: Municipality, attributes: [] }] }
          ]
        }
      ],
      group: ["Location.Neighborhood.Municipality.name"],
      order: [[sequelize.literal("total"), "DESC"]]
    });

    const cleanRanking = ranking.map(item => ({
      municipio: item.dataValues.municipio || "Sin municipio",
      total: Number(item.dataValues.total)
    }));

    res.json(cleanRanking);
  } catch (error) {
    console.error("ERROR RANKING:", error);
    res.status(500).json({ error: error.message });
  }
};

// =============================
// REPORTES ÚLTIMAS 12 HORAS
// =============================
exports.getLastReports = async (req, res) => {
  try {
    const twelveHoursAgo = new Date(); // Hora actual
    twelveHoursAgo.setHours(twelveHoursAgo.getHours() - 12); // Restamos 12 horas
// Buscamos reportes desde hace 12 horas, incluyendo ubicación y municipio
    const reports = await Report.findAll({
      include: [
        {
          model: Location,
          required: false,
          include: [
            {
              model: Neighborhood,
              required: false,
              include: [
                {
                  model: Municipality,
                  required: false
                }
              ]
            }
          ]
        }
      ],
      where: { report_date: { [Op.gte]: twelveHoursAgo } }, // Solo reportes de las últimas 12 horas
      order: [["report_date", "DESC"]],
      limit: 20
    });

    res.json(reports); // Devolvemos los reportes sin formatear, el frontend se encargará de mostrar municipio o "Sin municipio"
  } catch (error) {
    console.error("Error trayendo últimos reportes", error);
    res.status(500).json({ error: "Error al obtener reportes recientes" });
  }
};

// =============================
// VOTAR REPORTES
// =============================
exports.voteReport = async (req, res) => {
  try {
    const { report_id, vote, user_id } = req.body;
    if (!report_id || !vote || !user_id) return res.status(400).json({ error: "Datos incompletos" });

    const existing = await ReportValidation.findOne({ where: { report_id, user_id } });
    if (existing) return res.status(400).json({ error: "Ya votaste este reporte" });

    await ReportValidation.create({ report_id, user_id, vote });
    return res.json({ message: "Voto registrado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al votar" });
  }
};

// =============================
// REPORTES CON SCORE
// =============================
exports.getReportsWithScore = async (req, res) => {
  try {
    const reports = await Report.findAll({
      include: [
        {
          model: Location,
          include: [
            {
              model: Neighborhood,
              include: [{ model: Municipality }]
            }
          ]
        },
        { model: ReportValidation, attributes: ["vote"] }
      ],
      order: [["report_date", "DESC"]],
      limit: 20
    });

    const processed = reports.map(r => {
      const votes = r.ReportValidations || [];
      const score = votes.reduce((acc, v) => (v.vote === "up" ? acc + 1 : acc - 1), 0);

      return {
        id: r.id,
        description: r.description,
        report_date: r.report_date,
        status: r.status,
        Location: r.Location,
        score
      };
    });

    res.json(processed);
  } catch (error) {
    console.error("Error reports with score", error);
    res.status(500).json({ error: "Error trayendo reportes con score" });
  }
};

// =============================
// HEATMAP
// =============================
exports.getHeatmapReports = async (req, res) => {
  try {
    const reports = await Report.findAll({
      attributes: ["location_id", [sequelize.fn("COUNT", sequelize.col("Report.id")), "total"]],
      include: [{ model: Location, attributes: ["latitude", "longitude"] }],
      group: ["location_id", "Location.id"]
    });

    const heatmapData = reports.map(report => ({
      latitude: Number(report.Location.latitude),
      longitude: Number(report.Location.longitude),
      weight: Number(report.dataValues.total)
    }));

    res.json(heatmapData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generando heatmap" });
  }
};

// =============================
// ALERTAS DE SEGURIDAD
// =============================
exports.getSecurityAlerts = async (req, res) => {
  try {
    const sixHoursAgo = new Date();
    sixHoursAgo.setHours(sixHoursAgo.getHours() - 6);

    const alerts = await Report.findAll({
      attributes: [[sequelize.fn("COUNT", sequelize.col("Report.id")), "totalReports"]],
      where: { report_date: { [Op.gte]: sixHoursAgo } },
      include: [
        {
          model: Location,
          attributes: [],
          include: [
            { model: Neighborhood, attributes: [], include: [{ model: Municipality, attributes: ["id", "name"] }] }
          ]
        }
      ],
      group: ["Location.Neighborhood.Municipality.id", "Location.Neighborhood.Municipality.name"],
      having: sequelize.literal("COUNT(Report.id) >= 5"),
      order: [[sequelize.literal("totalReports"), "DESC"]]
    });

    const formattedAlerts = alerts.map(item => ({
      municipio: item.Location?.Neighborhood?.Municipality?.name || "Sin municipio",
      total: Number(item.dataValues.totalReports)
    }));

    res.json(formattedAlerts);
  } catch (error) {
    console.error("Error generando alertas", error);
    res.status(500).json({ error: "Error generando alertas" });
  }
};