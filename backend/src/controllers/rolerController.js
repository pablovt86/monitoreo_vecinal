const { Role } = require("../models");

exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.json(roles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener roles" });
  }
};

exports.createRole = async (req, res) => {
  try {
    const { name } = req.body;

    const role = await Role.create({ name });

    res.status(201).json(role);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error al crear rol" });
  }
};
