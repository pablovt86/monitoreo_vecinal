use monitoreo_vecinal;

/* Total de reportes*/

select count(*) from reports;


/*Reportes por estado*/
SELECT status, COUNT(*) 
FROM reports
GROUP BY status;

/*Incidentes por tipo*/
SELECT it.name, COUNT(r.id)
FROM reports r
JOIN incident_types it ON r.incident_type_id = it.id
GROUP BY it.name;

/*Zona Mas Activa */

SELECT l.neighborhood, COUNT(r.id)
FROM reports r
JOIN locations l ON r.location_id = l.id
GROUP BY l.neighborhood
ORDER BY COUNT(r.id) DESC;

/*Evolución temporal (por día / mes)*/
SELECT DATE(report_date) as fecha, COUNT(*) 
FROM reports
GROUP BY DATE(report_date)
ORDER BY fecha;


SELECT COUNT(*) FROM official_incidents;
SELECT * FROM official_incidents LIMIT 10;