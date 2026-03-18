const express = require("express");
const router = express.Router();

const zoneController = require("../controllers/zoneController");

router.get("/my-zone", zoneController.getMyZone);

module.exports = router;