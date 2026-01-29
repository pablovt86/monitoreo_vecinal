const { Alert } = require("../models");

exports.createAlert = async (req, res) => {
  const alert = await Alert.create({
    ...req.body,
    sent_at: new Date()
  });
  res.status(201).json(alert);
};
