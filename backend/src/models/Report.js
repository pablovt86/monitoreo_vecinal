module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define(
    "Report",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      incident_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      location_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      description: {        
        type: DataTypes.TEXT,
        allowNull: false
      },
      report_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    },
    {
      tableName: "reports",
      timestamps: false   // 
    }
  );

  return Report;
};
