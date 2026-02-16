/* =========================================================
   MONITOREO VECINAL - SCRIPT DE ÍNDICES
   Solo optimización - No modifica estructura base
   ========================================================= */

/* ===========================
   REPORTS
   =========================== */

CREATE INDEX idx_reports_user_id 
ON reports(user_id);

CREATE INDEX idx_reports_incident_type_id 
ON reports(incident_type_id);

CREATE INDEX idx_reports_location_id 
ON reports(location_id);

CREATE INDEX idx_reports_status 
ON reports(status);

CREATE INDEX idx_reports_report_date 
ON reports(report_date);


/* ===========================
   LOCATIONS
   =========================== */

CREATE INDEX idx_locations_neighborhood_id 
ON locations(neighborhood_id);

CREATE INDEX idx_locations_lat_lng 
ON locations(latitude, longitude);


/* ===========================
   INCIDENT TYPES
   =========================== */

CREATE UNIQUE INDEX idx_incident_types_name 
ON incident_types(name);


/* ===========================
   OFFICIAL INCIDENT STATS
   =========================== */

CREATE INDEX idx_official_name 
ON official_incident_stats(snic_name);

CREATE INDEX idx_official_year 
ON official_incident_stats(year);




/* =========================================================
   FIN DEL SCRIPT
   ========================================================= */
