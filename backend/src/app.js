const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/', (req, res) => {
  res.json({ message: 'Monitoreo Vecinal API funcionando' })
})





// prefijos de la API

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/users.routes"));
app.use("/api/incidents", require("./routes/incidentTypes.routes"));
app.use("/api/reports", require("./routes/reports.routes"));
app.use("/api/alerts", require("./routes/alerts.routes"));
app.use("/api/roles", require("./routes/roles.routes"));
app.use("/api/metrics", require("./routes/metrics.routes"))
app.use("/api/zones", require("./routes/zone.routes"));
app.use("/api/comments", require("./routes/comment.routes"));





module.exports = app
