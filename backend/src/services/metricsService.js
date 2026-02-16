/**
 * metricsService.js
 * --------------------------------------------------
 * Este servicio se encarga de:
 * - Cruce entre reportes ciudadanos
 * - Datos oficiales (SNIC u otros datasets)
 * - Devolver métricas comparables para dashboards
 * --------------------------------------------------
 */

// Importamos operadores y funciones de Sequelize
// fn → permite usar funciones SQL como COUNT(), SUM()
// col → referencia columnas de la base
// Op → operadores como BETWEEN, >, <, etc.
const { Op, fn, col } = require("sequelize");

// Importamos los modelos que vamos a cruzar
const {
  Report,
  OfficialIncident
} = require("../models");

/**
 * 🔎 Cruza datos ciudadanos con datos oficiales
 * --------------------------------------------------
 * @param {Object} filters
 * @param {Number} filters.year → año a filtrar (opcional)
 * @param {Number} filters.incidentTypeId → tipo de delito (opcional)
 * @param {Number} filters.locationId → zona/barrio (opcional)
 *
 * @returns {Array} métricas cruzadas
 */
async function crossOfficialWithCitizenData(filters = {}) {

  // Extraemos filtros (si no vienen quedan undefined)
  const { year, incidentTypeId, locationId } = filters;

  /**
   * ================================
   * 1️⃣ DATOS DE REPORTES CIUDADANOS
   * ================================
   * Contamos cuántos reportes hizo la gente
   * agrupados por tipo de delito
   */
  const citizenStats = await Report.findAll({
    attributes: [
      "incident_type_id",                      // agrupamos por tipo
      [fn("COUNT", col("id")), "total_reports"] // COUNT(id)
    ],
    where: {
      // Estos filtros solo se aplican si existen
      ...(incidentTypeId && { incident_type_id: incidentTypeId }),
      ...(locationId && { location_id: locationId }),
      ...(year && {
        occurred_date: {
          [Op.between]: [
            `${year}-01-01`,
            `${year}-12-31`
          ]
        }
      })
    },
    group: ["incident_type_id"], // GROUP BY
    raw: true                    // devuelve objetos simples
  });

  /**
   * ================================
   * 2️⃣ DATOS OFICIALES
   * ================================
   * Sumamos los hechos oficiales por tipo de delito
   */
  const officialStats = await OfficialIncident.findAll({
    attributes: [
      "incident_type_id",
      [fn("SUM", col("hechos")), "total_hechos"]
    ],
    where: {
      ...(incidentTypeId && { incident_type_id: incidentTypeId }),
      ...(year && { year })
    },
    group: ["incident_type_id"],
    raw: true
  });

  /**
   * ================================
   * 3️⃣ CRUCE DE AMBAS FUENTES
   * ================================
   * Unimos ciudadano + oficial por tipo de delito
   */
  const mergedStats = citizenStats.map((citizen) => {

    // Buscamos el mismo delito en los datos oficiales
    const official = officialStats.find(
      (o) => o.incident_type_id === citizen.incident_type_id
    );

    const citizenTotal = Number(citizen.total_reports);
    const officialTotal = official
      ? Number(official.total_hechos)
      : 0;

    return {
      incident_type_id: citizen.incident_type_id,
      citizen_reports: citizenTotal,
      official_reports: officialTotal,

      // ratio = qué tanto se reporta vs lo que realmente ocurre
      report_ratio:
        officialTotal > 0
          ? citizenTotal / officialTotal
          : null
    };
  });

  // Devolvemos el resultado final
  return mergedStats;
}

// Exportamos el servicio
module.exports = {
  crossOfficialWithCitizenData
};
