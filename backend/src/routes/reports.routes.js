
const router = require("express").Router();

const {
  createReport,
  getReports,
  getRankingByMunicipality,
  getLastReports,
  getHeatmapReports,
  getSecurityAlerts,
  voteReport,
  getReportsWithScore,
  getReportById,
  updateReportStatus
} = require("../controllers/reportsController");

const auth = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

// =============================
// 🔥 CREATE REPORT (ÚNICA RUTA CORRECTA)
// =============================
router.post("/", auth, upload.single("image"), createReport);

// =============================
// 📄 GETS
// =============================
router.get("/last", getLastReports);
router.get("/alerts", getSecurityAlerts);
router.get("/heatmap", getHeatmapReports);
router.get("/ranking/municipality", getRankingByMunicipality);
router.get("/with-score", auth, getReportsWithScore);

router.get("/", auth, getReports);

// 🔥 SIEMPRE AL FINAL
router.get("/:id", auth, getReportById);

// =============================
// 🔧 UPDATE
// =============================
router.patch("/:id/status", auth, updateReportStatus);

// =============================
// 👍 VOTE
// =============================
router.post("/vote", auth, voteReport);

module.exports = router;
