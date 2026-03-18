const db = require("../models")
const { Sequelize } = require("sequelize");
const Alert = db.Alert

exports.detectDangerZones = async (req, res) => {

 try {

   const dangerZones = await db.sequelize.query(`
     SELECT 
     n.name AS neighborhood,
     m.name AS municipality,
     COUNT(r.id) AS total_reports
     FROM reports r
     JOIN locations l ON r.location_id = l.id
     JOIN neighborhoods n ON l.neighborhood_id = n.id
     JOIN municipalities m ON n.municipality_id = m.id
     WHERE r.created_at >= NOW() - INTERVAL 2 HOUR
     GROUP BY n.id
     HAVING COUNT(r.id) >= 5
   `, { type: Sequelize.QueryTypes.SELECT })

   for (const zone of dangerZones) {

     await Alert.create({
       message: `⚠ Zona peligrosa detectada en ${zone.neighborhood}, ${zone.municipality} con ${zone.total_reports} reportes`,
       sent_at: new Date()
     })

   }

   res.json(dangerZones)

 } catch (error) {

   console.error(error)
   res.status(500).json({ error: "Error detecting danger zones" })

 }

}