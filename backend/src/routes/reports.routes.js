const router = require("express").Router();
const {
  createReport,
  getReports,
  updateReportStatus,
  getRankingByMunicipality,
  getLastReports,
  getHeatmapReports,
  getSecurityAlerts

} = require("../controllers/reportsController");
const auth = require("../middlewares/authMiddleware");
const { checkRole } = require("../middlewares/roleMiddleware");

router.post("/", auth,checkRole([1]), createReport);
router.get("/",  auth,getReports);
router.get("/last",getLastReports);
router.get("/alerts",getSecurityAlerts);
router.get("/heatmap", getHeatmapReports);
router.patch("/:id/status", auth, updateReportStatus);
router.get("/ranking/municipality", getRankingByMunicipality);




module.exports = router;
