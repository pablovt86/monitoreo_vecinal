const router = require("express").Router();
const {
   getIncidentTypes,  
  createIncidentType
 
} = require("../controllers/incidentTypesController");

router.get("/", getIncidentTypes);
router.post("/", createIncidentType);


module.exports = router;
