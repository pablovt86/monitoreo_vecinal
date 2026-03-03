 module.exports = (sequelize, DataTypes) => {
  const Neighborhood = sequelize.define("Neighborhood", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false    
        },
    municipality_id: {
        type: DataTypes.INTEGER,
        allowNull: false,       
        references: {
            model: "Municipalities",
            key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE" 
    }
  }, {
    tableName: "neighborhoods",
    timestamps: false
   });  
   
  return Neighborhood;
};