const fs = require("fs");
const path = require("path");

const LOG_DIR = path.join(__dirname, "../../logs");
const REJECTED_LOG = path.join(LOG_DIR, "rejected_incidents.log");

function logRejectedIncident({ incident, reason, stage }) {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }

  const logEntry = {
    timestamp: new Date().toISOString(),
    stage,
    reason,
    external_id: incident.external_id || null,
    source: incident.source || null,
    incident
  };

  fs.appendFileSync(
    REJECTED_LOG,
    JSON.stringify(logEntry) + "\n"
  );
}

module.exports = {
  logRejectedIncident
};
