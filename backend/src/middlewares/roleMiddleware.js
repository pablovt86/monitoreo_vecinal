const { User, Role } = require("../models");

exports.checkRole = (rolesPermitidos = []) => {
  return async (req, res, next) => {
    try {
      console.log("PASÓ AUTH");
      console.log("USER JWT:", req.user);

      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Usuario no autenticado" });
      }

      const user = await User.findByPk(req.user.id, {
        include: {
          model: Role,
          attributes: ["name"]
        }
      });

      console.log("USER DB:", user?.toJSON());

      if (!user || !user.Role) {
        return res.status(403).json({ error: "Rol no asignado" });
      }

      if (!rolesPermitidos.includes(user.Role.name)) {
        return res.status(403).json({
          error: "No tenés permisos para esta acción"
        });
      }

      next();
    } catch (error) {
      console.error("🔥 ERROR ROLE:", error);
      res.status(500).json({ error: "Error de autorización" });
    }
  };
};
