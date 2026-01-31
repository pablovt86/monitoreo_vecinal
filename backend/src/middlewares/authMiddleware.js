const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  console.log("🔐 AUTH MIDDLEWARE");

  const authHeader = req.headers.authorization;
  console.log("AUTH HEADER:", authHeader);

  if (!authHeader) {
    return res.status(401).json({ error: "Token nnd no proporcionado" });
  }

  const token = authHeader.split(" ")[1];
  console.log("TOKEN EXTRAÍDO:", token);

  if (!token) {
    return res.status(401).json({ error: "Token inválido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("TOKEN DECODIFICADO:", decoded);

    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT ERROR:", error.message);
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};
