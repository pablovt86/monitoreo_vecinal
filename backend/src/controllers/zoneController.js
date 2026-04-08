const db = require("../models");

module.exports = {
  getMyZone: async (req, res) => {
    try {
      const { lat, lng } = req.query;

      if (!lat || !lng) {
        return res.status(400).json({ error: "Faltan coordenadas" });
      }

      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);

      // 🧠 Traemos reportes con ubicación
      const reports = await db.Report.findAll({
        include: [
          {
            model: db.Location,
            include: [
              {
                model: db.Neighborhood,
                include: [db.Municipality],
              },
            ],
          },
        ],
      });

      // 🔥 FUNCIÓN DISTANCIA REAL (Haversine)
      const getDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;

        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1 * Math.PI / 180) *
          Math.cos(lat2 * Math.PI / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      };

      // 🔥 FILTRAMOS POR DISTANCIA (5 km)
     const now = new Date();
const last12h = new Date(now.getTime() - 12 * 60 * 60 * 1000);

const nearbyReports = reports.filter(r => {
  const loc = r.Location;

  if (!loc?.latitude || !loc?.longitude) return false;

  const distance = getDistance(
    userLat,
    userLng,
    parseFloat(loc.latitude),
    parseFloat(loc.longitude)
  );

  const reportDate = new Date(r.report_date);
  console.log("REPORT DATE:", r.report_date);

  return distance <= 5 && reportDate >= last12h;
});

      // 🧠 Municipio real (del primer reporte cercano)
      const municipality =
        nearbyReports[0]?.Location?.Neighborhood?.Municipality?.name ||
        "Sin datos";

      return res.json({
        zone: {
          municipality,
        },
        reports: nearbyReports,
      });

    } catch (error) {
      console.error("Error en myZone:", error);
      res.status(500).json({ error: "Error interno" });
    }
  },
};