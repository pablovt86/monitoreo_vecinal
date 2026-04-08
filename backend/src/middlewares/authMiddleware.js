const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  console.log("🔐 AUTH MIDDLEWARE");

  const authHeader = req.headers.authorization;
  console.log("AUTH HEADER:", authHeader);

  // ✅ Validar header correctamente
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token no proporcionado o mal formado" });
  }

  const token = authHeader.split(" ")[1];
  console.log("TOKEN EXTRAÍDO:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("TOKEN DECODIFICADO:", decoded);

    req.user = decoded;

    next();
  } catch (error) {
    console.error("JWT ERROR:", error.message);

    return res.status(403).json({
      error: "Token inválido o expirado"
    });
  }
};