# 🛡️ Monitoreo Vecinal - Plataforma de Seguridad Ciudadana

## 📌 Descripción del Proyecto

**Monitoreo Vecinal** es una plataforma tecnológica orientada a mejorar la seguridad ciudadana mediante la recolección, análisis y visualización de reportes en tiempo real realizados por vecinos.

El sistema permite identificar zonas críticas, generar rankings por municipio y visualizar incidentes mediante mapas interactivos, facilitando la toma de decisiones por parte de autoridades y ciudadanos.

---

## 🎯 Objetivo

El objetivo principal del proyecto es:

* Proveer una herramienta digital para reportar incidentes de forma rápida y sencilla.
* Centralizar la información en tiempo real.
* Generar métricas y visualizaciones que permitan detectar patrones delictivos.
* Mejorar la prevención mediante datos.

---

## 🧠 Enfoque del Proyecto

Este sistema fue diseñado bajo un enfoque de:

* **Escalabilidad**: preparado para crecer a nivel municipal o provincial.
* **Modularidad**: backend desacoplado del frontend.
* **Experiencia de usuario**: interfaz simple y rápida.
* **Data-driven**: decisiones basadas en datos reales.

---

## 🏗️ Arquitectura del Sistema

El proyecto sigue una arquitectura cliente-servidor:

### 🔹 Frontend

* React Native (Expo)
* Visualización de mapas (Heatmap)
* Interfaz de reportes
* Geolocalización en tiempo real

### 🔹 Backend

* Node.js
* Express
* API RESTful

### 🔹 Base de Datos

* MySQL
* Modelo relacional optimizado

---

## ⚙️ Funcionalidades Principales

* 🔐 Autenticación de usuarios
* 📍 Geolocalización de incidentes
* 📝 Creación y gestión de reportes (CRUD)
* 📊 Ranking de municipios con mayor cantidad de incidentes
* 🔥 Mapa de calor (Heatmap)
* ⏱️ Filtro de reportes recientes (últimas 12 horas)
* 📡 API estructurada para consumo externo

---

## 🗃️ Modelo de Datos (Resumen)

Principales entidades del sistema:

* **User**: usuarios registrados
* **Report**: incidentes reportados
* **Location**: ubicación del incidente
* **Neighborhood**: barrio
* **Municipality**: municipio

Relación jerárquica:

```
Report → Location → Neighborhood → Municipality
```

---

## 🔍 Justificación Técnica

Las decisiones técnicas fueron tomadas considerando:

* **Node.js + Express**: rapidez en desarrollo y escalabilidad.
* **MySQL**: consistencia y relaciones estructuradas.
* **React Native (Expo)**: desarrollo multiplataforma eficiente.
* **Arquitectura REST**: interoperabilidad con otros sistemas.

---

## 📈 Lógica de Negocio Implementada

* Ranking de municipios utilizando `GROUP BY`
* Filtro temporal de reportes recientes
* Asociación relacional entre ubicaciones
* Preparación de datos para visualización en mapas

---

## 🚀 Estado Actual del Proyecto

✔️ Autenticación implementada
✔️ CRUD de reportes funcional
✔️ Ranking por municipio operativo
✔️ Heatmap integrado
✔️ Geolocalización activa
✔️ Backend estructurado y documentado

🛠️ En progreso:

* Optimización de consultas
* Mejora de rendimiento
* Validaciones avanzadas

---

## 🧪 Posibles Mejoras Futuras

* Implementación de IA para predicción de zonas críticas
* Notificaciones en tiempo real
* Panel administrativo para municipios
* Integración con cámaras de seguridad

---

## 🛡️ Público Objetivo

* Municipios
* Fuerzas de seguridad
* Comunidades barriales
* Empresas de monitoreo

---

## 📦 Instalación del Proyecto

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/monitoreo-vecinal.git

# Instalar dependencias backend
cd backend
npm install

# Ejecutar servidor
npm run dev

# Frontend
cd frontend
npm install
expo start
```

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes, abrir un issue primero para discutir lo que se desea modificar.

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

---

## 👨‍💻 Autor

Desarrollado por **Pablo Vaccotti**
Proyecto orientado a soluciones tecnológicas para seguridad ciudadana.

---
