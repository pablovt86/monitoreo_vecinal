const service = require('../services/incidentTypesService');
const { Report } = require("../models");

async function getIncidentTypes(req, res) {
  try {
    const data = await service.getAllIncidentTypes();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}





const createIncident = async (req, res) => {
  try {
    console.log("llegó al controller");

    const { description, user_id, incident_type_id, location_id } = req.body;

    if (!description || !user_id || !incident_type_id || !location_id) {
      return res.status(400).json({
        error: "Faltan datos obligatorios"
      });
    }

    const report = await Report.create({
      description,
      user_id,
      incident_type_id,
      location_id,
      report_date: new Date()
    });

    res.status(201).json(report);

  } catch (error) {
    console.error("❌ Error al crear reporte:", error);
    res.status(500).json({ error: "Error al crear reporte" });
  }
};

module.exports = { createIncident,getIncidentTypes};
