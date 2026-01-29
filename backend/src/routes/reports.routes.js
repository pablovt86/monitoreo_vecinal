const router = require("express").Router();
const {
  createReport,
  getReports,
  updateReportStatus
} = require("../controllers/reportsController");

router.post("/", createReport);
router.get("/", getReports);
router.patch("/:id/status", updateReportStatus);

module.exports = router;
