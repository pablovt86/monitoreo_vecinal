const express = require('express');
const router = express.Router();
const controller = require('../controllers/incidentTypesController');

router.get('/', controller.getIncidentTypes);

router.post('/', controller.createIncident);

module.exports = router;
