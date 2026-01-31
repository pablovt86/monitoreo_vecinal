// models/AuditLog.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("AuditLog", {
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    entity: DataTypes.STRING,
    entity_id: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    ip_address: DataTypes.STRING,
    user_agent: DataTypes.TEXT
  }, {
    tableName: "audit_logs",
    timestamps: false
  });
};
