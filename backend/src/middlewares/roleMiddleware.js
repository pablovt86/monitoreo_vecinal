const { User, Role } = require("../models");

exports.checkRole = (rolesPermitidos = []) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id; // viene del middleware JWT

      const user = await User.findByPk(userId, {
        include: Role
      });

      if (!user || !user.Role) {
        return res.status(403).json({ error: "Acceso denegado" });
      }

      if (!rolesPermitidos.includes(user.Role.name)) {
        return res.status(403).json({
          error: "No tenés permisos para esta acción"
        });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error de autorización" });
    }
  };
};
