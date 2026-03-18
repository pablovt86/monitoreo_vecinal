const express = require("express")
const router = express.Router()

const alertController = require("../controllers/alertsController")

router.get("/detect", alertController.detectDangerZones)

module.exports = router