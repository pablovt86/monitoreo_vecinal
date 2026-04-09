require('dotenv').config()
const app = require('./app')
const { sequelize } = require("./models");

const PORT = process.env.PORT || 3000


app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
sequelize.authenticate()
  .then(() => console.log("✅ DB conectada"))
  .catch(err => console.error("❌ Error DB:", err));