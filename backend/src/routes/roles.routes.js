const express = require("express");
const router = express.Router();
const roleController = require("../controllers/rolerController");

router.get("/", roleController.getRoles);
router.post("/", roleController.createRole);

module.exports = router;
