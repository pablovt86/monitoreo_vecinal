const {
  Report,
  User,
  IncidentType,
  Location
} = require("../models");

exports.createReport = async (req, res) => {
  try {
    const {
      user_id,
      incident_type_id,
      location_id,
      description
    } = req.body;

    // 1️⃣ Validaciones de existencia (FOREIGN KEYS)
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

    // 2️⃣ Crear reporte
    const report = await Report.create({
      description,
      user_id,
      incident_type_id,
      location_id,
      status: "pendiente",
      report_date: new Date()
    });

    res.status(201).json(report);

  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error al crear reporte" });
  }
};

exports.getReports = async (req, res) => {
  try {
    const reports = await Report.findAll({
      include: [
        { model: User },
        { model: IncidentType },
        { model: Location }
      ]
    });

    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener reportes" });
  }
};

exports.updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;

    await Report.update(
      { status },
      { where: { id: req.params.id } }
    );

    res.json({ message: "Estado actualizado" });

  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error al actualizar estado" });
  }
};
