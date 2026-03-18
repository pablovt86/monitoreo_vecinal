// Importamos todos los modelos que necesitamos
const {
  Report,
  User,
  IncidentType,
  Location,
  sequelize,
  Neighborhood,
  Municipality
} = require("../models");

// Importamos operadores de Sequelize (para filtros de fechas)
const { Op } = require("sequelize");



/* =========================================================
   CREAR REPORTE
   ========================================================= */

exports.createReport = async (req, res) => {
  try {

    // Extraemos los datos enviados por el frontend
    const {
      user_id,
      incident_type_id,
      location_id,
      description
    } = req.body;

    // 🔹 Validamos que el usuario exista
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(400).json({ error: "Usuario inexistente" });
    }

    // 🔹 Validamos que el tipo de incidente exista
    const incidentType = await IncidentType.findByPk(incident_type_id);
    if (!incidentType) {
      return res.status(400).json({ error: "Tipo de incidente inexistente" });
    }

    // 🔹 Validamos que la ubicación exista
    const location = await Location.findByPk(location_id);
    if (!location) {
      return res.status(400).json({ error: "Ubicación inexistente" });
    }

    // 🔹 Creamos el reporte en la base de datos
    const report = await Report.create({
      description,
      user_id,
      incident_type_id,
      location_id,
      status: "pendiente",
      report_date: new Date()
    });

    // Enviamos el reporte creado
    res.status(201).json(report);

  } catch (error) {

    console.error(error);

    res.status(400).json({
      error: "Error al crear reporte"
    });

  }
};



/* =========================================================
   TRAER TODOS LOS REPORTES
   ========================================================= */

exports.getReports = async (req, res) => {

  try {

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
                  model: Municipality
                }

              ]
            }

          ]
        }

      ]

    });

    res.json(reports);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error al obtener reportes"
    });

  }

};


/* =========================================================
   ACTUALIZAR ESTADO DEL REPORTE
   ========================================================= */

exports.updateReportStatus = async (req, res) => {

  try {

    const { status } = req.body;

    await Report.update(

      { status },

      { where: { id: req.params.id } }

    );

    res.json({
      message: "Estado actualizado"
    });

  } catch (error) {

    console.error(error);

    res.status(400).json({
      error: "Error al actualizar estado"
    });

  }

};



/* =========================================================
   RANKING DE MUNICIPIOS (CORREGIDO)
   ========================================================= */
exports.getRankingByMunicipality = async (req, res) => {
  try {

    const ranking = await Report.findAll({

      attributes: [

        // 🔹 nombre del municipio directamente desde el JOIN
        [
          sequelize.col("Location.Neighborhood.Municipality.name"),
          "municipio"
        ],

        // 🔹 total de reportes
        [
          sequelize.fn("COUNT", sequelize.col("Report.id")),
          "total"
        ]

      ],

      include: [
        {
          model: Location,
          attributes: [],
          include: [
            {
              model: Neighborhood,
              attributes: [],
              include: [
                {
                  model: Municipality,
                  attributes: []
                }
              ]
            }
          ]
        }
      ],

      group: [
        "Location.Neighborhood.Municipality.name"
      ],

      order: [
        [sequelize.literal("total"), "DESC"]
      ]

    });


    // 🔥 ahora los datos ya vienen planos
    const cleanRanking = ranking.map(item => ({
      municipio: item.dataValues.municipio || "Sin municipio",
      total: Number(item.dataValues.total)
    }));


    res.json(cleanRanking);

  } catch (error) {

    console.error("ERROR RANKING:", error);

    res.status(500).json({
      error: error.message
    });

  }
};

/* =========================================================
   REPORTES DE LAS ÚLTIMAS 12 HORAS (CARRUSEL)
   ========================================================= */
exports.getLastReports = async (req, res) => {
  try {

    // fecha hace 12 horas
    const twelveHoursAgo = new Date();
    twelveHoursAgo.setHours(twelveHoursAgo.getHours() - 12);
    const reports = await Report.findAll({
    
      include: [
        {
          model: Location,
          include: [
            {
              model: Neighborhood,
              include: [
                {
                  model: Municipality
                }
              ]
            }
          ]
        }
      ],

      order: [["report_date", "DESC"]],

      limit: 20

    });

    res.json(reports);

  } catch (error) {

    console.error("Error trayendo últimos reportes", error);

    res.status(500).json({
      error: "Error al obtener reportes recientes"
    });

  }
};

/* =========================================================
   HEATMAP DEL MAPA
   ========================================================= */

exports.getHeatmapReports = async (req, res) => {

  try {

    const reports = await Report.findAll({

      attributes: [

        "location_id",

        [
          sequelize.fn("COUNT", sequelize.col("Report.id")),
          "total"
        ]

      ],

      include: [

        {
          model: Location,

          attributes: ["latitude", "longitude"]

        }

      ],

      group: [
        "location_id",
        "Location.id"
      ]

    });


    // 🔥 Convertimos datos al formato que usa react-native-maps
    const heatmapData = reports.map(report => ({

      latitude: Number(report.Location.latitude),

      longitude: Number(report.Location.longitude),

      weight: Number(report.dataValues.total)

    }));


    res.json(heatmapData);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error generando heatmap"
    });

  }

};
exports.getSecurityAlerts = async (req, res) => {

  try {

    // 🔹 calculamos la fecha de hace 6 horas
    const sixHoursAgo = new Date();
    sixHoursAgo.setHours(sixHoursAgo.getHours() - 6);

    const alerts = await Report.findAll({

      attributes: [
        [sequelize.fn("COUNT", sequelize.col("Report.id")), "totalReports"]
      ],

      where: {
        report_date: {
          [Op.gte]: sixHoursAgo
        }
      },

      include: [
        {
          model: Location,
          attributes: [],
          include: [
            {
              model: Neighborhood,
              attributes: [],
              include: [
                {
                  model: Municipality,
                  attributes: ["id", "name"]
                }
              ]
            }
          ]
        }
      ],

      group: [
        "Location.Neighborhood.Municipality.id",
        "Location.Neighborhood.Municipality.name"
      ],

      // 🔥 solo municipios con más de 5 reportes
      having: sequelize.literal("COUNT(Report.id) >= 5"),

      order: [
        [sequelize.literal("totalReports"), "DESC"]
      ]

    });

    // 🔥 FORMATEAMOS RESPUESTA PARA EL FRONTEND
    const formattedAlerts = alerts.map(item => ({

      municipio: item.Location?.Neighborhood?.Municipality?.name || "Sin municipio",

      total: Number(item.dataValues.totalReports)

    }));

    res.json(formattedAlerts);

  } catch (error) {

    console.error("Error generando alertas", error);

    res.status(500).json({
      error: "Error generando alertas"
    });

  }

};
