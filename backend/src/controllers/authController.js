const { User } = require("../models");

exports.register = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: "Error al registrar usuario" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email, password } });
  if (!user) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  res.json({ message: "Login OK", user });
};
