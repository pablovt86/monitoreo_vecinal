# AI CORE CONTEXT – Monitoreo Vecinal

## 🧠 Modelo mental del sistema

User crea Report  
Report SIEMPRE tiene Location  
Location pertenece a Neighborhood → Municipality  

## ⚠️ Reglas críticas

- Location NO se duplica (se busca por lat/lng)
- Address es obligatorio (NOT NULL)
- Report depende de Location SIEMPRE

## 🔥 Dependencias sensibles

- Ranking depende de Municipality (JOIN profundo)
- Heatmap depende de location_id agrupado
- Alerts depende de cantidad de reportes en ventana de tiempo

## ⚠️ Lógica de negocio

- Report tiene estado (pendiente → en_proceso → resuelto)
- Report tiene votos (ReportValidation)
- Score se calcula dinámicamente
- Alerts se generan por volumen (>=5 en 6h)

## 🚨 Cosas que NO romper

- Relaciones Location → Neighborhood → Municipality
- Agrupación por location_id
- Filtro por municipio con include

## 🧪 Estado actual conocido

- Backend funcional
- Ranking OK
- Heatmap OK
- Últimos reportes OK
- Problemas en conexión frontend (/api/reports)

## 🎯 En desarrollo

- Filtro últimas 12h
- Personalización por zona