const db = require('../config/database/db');

async function getAllIncidentTypes() {
  const [rows] = await db.query(
    'SELECT id, name, description FROM incident_types'
  );
  return rows;
}

module.exports = {
  getAllIncidentTypes
};
