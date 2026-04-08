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
const { Op } = require("sequelize");



/* =========================================================
   CREAR REPORTE
   ========================================================= */
exports.createReport = async (req, res) => {
  try {

    const user_id = req.user.id; // 👈 🔥 CLAVE

    const {
      incident_type_id,
      location_id,
      description
    } = req.body;

    const imagePath = req.file ? req.file.filename : null;

    // Validaciones
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(400).json({ error: "Usuario inexistente" });
    }

    const incidentType = await IncidentType.findByPk(incident_type_id);
    if (!incidentType) {
      return res.status(400).json({ error: "Tipo de incidente inexistente" });
    }

    const location = await Location.findByPk(location_id);
    if (!location) {
      return res.status(400).json({ error: "Ubicación inexistente" });
    }

    const report = await Report.create({
      description,
      user_id,
      incident_type_id,
      location_id,
      image: imagePath,
      status: "pendiente",
      report_date: new Date()
    });

    res.status(201).json(report);

  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error al crear reporte" });
  }
};








/* =========================================================
   CREAR REPORTE CON IMAGEN (CORREGIDO)
   ========================================================= */
exports.createReport = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const user_id = req.user?.id;

    if (!user_id) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const {
      incident_type_id,
      description,
      latitude,
      longitude
    } = req.body;

    // =============================
    // 🔥 VALIDACIONES
    // =============================
    if (!description || !incident_type_id) {
      return res.status(400).json({
        error: "Faltan datos obligatorios"
      });
    }

    if (!latitude || !longitude) {
      return res.status(400).json({
        error: "Faltan coordenadas"
      });
    }

    // =============================
    // 🔥 VALIDAR INCIDENT TYPE
    // =============================
    const incidentType = await IncidentType.findByPk(incident_type_id);
    if (!incidentType) {
      return res.status(400).json({
        error: "Tipo de incidente inexistente"
      });
    }

    // =============================
    // 🔥 CREAR / BUSCAR LOCATION
    // =============================
    let location = await Location.findOne({
      where: {
        latitude,
        longitude
      }
    });

    if (!location) {
      location = await Location.create({
        latitude,
        longitude
      });
    }

    // =============================
    // 📷 IMAGEN
    // =============================
    const image = req.file ? req.file.filename : null;

    // =============================
    // 🚀 CREAR REPORTE
    // =============================
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
    console.log("ERROR BACKEND:", error);
    res.status(500).json({
      error: "Error creando reporte",
      detalle: error.message
    });
  }
};
/* =========================================================
   TRAER TODOS LOS REPORTES
   ========================================================= */

exports.getReports = async (req, res) => {

  try {
console.log("ID:", req.params.id);
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

const baseUrl = "http://192.168.1.44:3000";

const reportsFormatted = reports.map(report => ({
  ...report.toJSON(),
  image: report.image
    ? `${baseUrl}/uploads/${report.image}`
    : null
}));

res.json(reportsFormatted);




  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error al obtener reportes"
    });

  }

};



/* =========================================================
   TRAER UN REPORTE POR ID
   ========================================================= */
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
      return res.status(404).json({
        error: "Reporte no encontrado"
      });
    }

    // 🔥 CLAVE: construir URL de imagen
    const baseUrl = "http://192.168.1.44:3000";

    const reportFormatted = {
      ...report.toJSON(),
      image: report.image
        ? `${baseUrl}/uploads/${report.image}`
        : null
    };

    res.json(reportFormatted);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al obtener el reporte"
    });
  }
};
exports.updateReportStatus = async (req, res) => {
  try {

    const { id } = req.params;
    const { status } = req.body;

    const report = await Report.findByPk(id);

    if (!report) {
      return res.status(404).json({
        error: "Reporte no encontrado"
      });
    }

    report.status = status;
    await report.save();

    res.json({
      message: "Estado actualizado",
      report
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error actualizando estado"
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
   Validamos los Reportes 
   ========================================================= */

exports.voteReport = async (req, res) => {
  try {
    const { report_id, vote, user_id } = req.body;

    if (!report_id || !vote || !user_id) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    // 🔥 evitar doble voto
    const existing = await ReportValidation.findOne({
      where: { report_id, user_id }
    });

    if (existing) {
      return res.status(400).json({ error: "Ya votaste este reporte" });
    }

    await ReportValidation.create({
      report_id,
      user_id,
      vote
    });

    return res.json({ message: "Voto registrado" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al votar" });
  }
};

/* =========================================================
   Validamos los Reportes con VOTOS (CORREGIDO)
    - Ahora sí sumamos votos positivos y negativos para cada reporte
    - Y devolvemos un "score" total junto con los datos del reporte
   ========================================================= */


exports.getReportsWithScore = async (req, res) => {
  try {

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
        },
        {
          model: ReportValidation,
          attributes: ["vote"]
        }
      ],
      order: [["report_date", "DESC"]],
      limit: 20
    });
    const processed = reports.map(r => {

      const votes = r.ReportValidations || [];

      const score = votes.reduce((acc, v) => {
        return v.vote === "up" ? acc + 1 : acc - 1;
      }, 0);

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

    res.status(500).json({
      error: "Error trayendo reportes con score"
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
