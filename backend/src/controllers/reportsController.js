const {
  Report,
  User,
  IncidentType,
  Location
} = require("../models");

exports.createReport = async (req, res) => {
  try {
    const report = await Report.create({
      ...req.body,
      report_date: new Date()
    });
    res.status(201).json(report);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error al crear reporte" });
  }
};

exports.getReports = async (req, res) => {
  const reports = await Report.findAll({
    include: [User, IncidentType, Location]
  });
  res.json(reports);
};

exports.updateReportStatus = async (req, res) => {
  const { status } = req.body;

  await Report.update(
    { status },
    { where: { id: req.params.id } }
  );

  res.json({ message: "Estado actualizado" });
};
