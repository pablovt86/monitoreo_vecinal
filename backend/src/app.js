const express = require('express')
const cors = require('cors')
const app = express()
const incidentTypesRoutes = require('./routes/incidentTypesRoutes');

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Monitoreo Vecinal API funcionando' })
})




// prefijo de la API
app.use("/api/incidents", incidentTypesRoutes );

const db = require("./config/database/db");



module.exports = app
