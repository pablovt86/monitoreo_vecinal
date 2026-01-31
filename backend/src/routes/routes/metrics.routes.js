const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const { checkRole } = require("../middlewares/roleMiddleware");

const {
  getTotalReports,
  getReportsByStatus,
  getReportsByNeighborhood,
  getReportsByIncidentType
} = require("../controllers/metricsController");

/**
 * Métricas solo para roles autorizados (admin / moderador)
 */
router.get("/total", auth, checkRole(["admin"]), getTotalReports);
router.get("/by-status", auth, checkRole(["admin"]), getReportsByStatus);
router.get("/by-neighborhood", auth, checkRole(["admin"]), getReportsByNeighborhood);
router.get("/by-incident-type", auth, checkRole(["admin"]), getReportsByIncidentType);

module.exports = router;
