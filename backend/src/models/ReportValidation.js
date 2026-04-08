module.exports = (sequelize, DataTypes) => {

  const ReportValidation = sequelize.define("ReportValidation", {

    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    report_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    vote: {
      type: DataTypes.ENUM("up", "down"),
      allowNull: false
    }

  }, {
    tableName: "report_validations",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false // no necesitamos updated_at
  });

  // =============================
  // ASOCIACIONES
  // =============================

  ReportValidation.associate = (models) => {

    ReportValidation.belongsTo(models.Report, {
      foreignKey: "report_id"
    });

    ReportValidation.belongsTo(models.User, {
      foreignKey: "user_id"
    });

  };

  return ReportValidation;

};