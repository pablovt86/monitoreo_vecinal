const { IncidentType } = require("../models");

exports.createIncidentType = async (req, res) => {
  try {
    const incident = await IncidentType.create(req.body);
    res.status(201).json(incident);
  } catch (error) {
    res.status(400).json({ error: "Error al crear tipo de incidente" });
  }
};

exports.getIncidentTypes = async (req, res) => {
  const incidents = await IncidentType.findAll();
  res.json(incidents);
};
