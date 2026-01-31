// src/utils/auditLogger.js
const { AuditLog } = require("../models");

module.exports = async ({
  user_id = null,
  action,
  entity = null,
  entity_id = null,
  description = null,
  req
}) => {
  try {
    await AuditLog.create({
      user_id,
      action,
      entity,
      entity_id,
      description,
      ip_address: req?.ip || null,
      user_agent: req?.headers?.["user-agent"] || null
    });
  } catch (error) {
    // ⚠️ La auditoría NO debe romper la app
    console.error("AUDIT LOG ERROR:", error.message);
  }
};
