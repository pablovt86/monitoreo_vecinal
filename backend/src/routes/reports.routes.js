const router = require("express").Router();
const {
  createReport,
  getReports,
  updateReportStatus
} = require("../controllers/reportsController");
const auth = require("../middlewares/authMiddleware");
const { checkRole } = require("../middlewares/roleMiddleware");

router.post("/", auth,checkRole([1]), createReport);
router.get("/",  auth,getReports);
router.patch("/:id/status", auth, updateReportStatus);




module.exports = router;
