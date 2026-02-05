DROP DATABASE IF EXISTS monitoreo_vecinal;
CREATE DATABASE monitoreo_vecinal;
USE monitoreo_vecinal;

-- =========================
-- ROLES
-- =========================
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Roles base del sistema
INSERT INTO roles (id, name) VALUES
(1, 'admin'),
(2, 'moderador'),
(3, 'usuario');

-- =========================
-- USUARIOS
-- =========================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INT NOT NULL DEFAULT 3,
    phone VARCHAR(30),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_users_roles
        FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- =========================
-- TIPOS DE INCIDENTES
-- =========================
CREATE TABLE incident_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    severity_level INT CHECK (severity_level BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- UBICACIONES
-- =========================
CREATE TABLE locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    address VARCHAR(255) NOT NULL,
    neighborhood VARCHAR(100),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- REPORTES
-- =========================
CREATE TABLE reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    incident_type_id INT NOT NULL,
    location_id INT NOT NULL,
    description TEXT NOT NULL,
    report_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pendiente', 'en_proceso', 'resuelto') DEFAULT 'pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_reports_user
        FOREIGN KEY (user_id) REFERENCES users(id),

    CONSTRAINT fk_reports_incident_type
        FOREIGN KEY (incident_type_id) REFERENCES incident_types(id),

    CONSTRAINT fk_reports_location
        FOREIGN KEY (location_id) REFERENCES locations(id)
);

-- =========================
-- IMÁGENES DE REPORTES
-- =========================
CREATE TABLE report_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_report_images_report
        FOREIGN KEY (report_id) REFERENCES reports(id)
);

-- =========================
-- ALERTAS
-- =========================
CREATE TABLE alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_id INT NOT NULL,
    message TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_alerts_report
        FOREIGN KEY (report_id) REFERENCES reports(id)
);

-- =========================
-- HISTORIAL DE ESTADOS
-- =========================
CREATE TABLE report_status_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_id INT NOT NULL,
    old_status ENUM('pendiente', 'en_proceso', 'resuelto'),
    new_status ENUM('pendiente', 'en_proceso', 'resuelto'),
    changed_by INT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_status_history_report
        FOREIGN KEY (report_id) REFERENCES reports(id),

    CONSTRAINT fk_status_history_user
        FOREIGN KEY (changed_by) REFERENCES users(id)
);

CREATE TABLE audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  action VARCHAR(100) NOT NULL,
  entity VARCHAR(100),
  entity_id INT,
  description TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_audit_user
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE official_incidents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  incident_type_id INT NOT NULL,
  location_id INT NOT NULL,
  occurred_date DATE NOT NULL,
  source VARCHAR(100) NOT NULL,
  external_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_official_incident_type
    FOREIGN KEY (incident_type_id) REFERENCES incident_types(id),

  CONSTRAINT fk_official_location
    FOREIGN KEY (location_id) REFERENCES locations(id)
);
CREATE TABLE official_incident_stats (
  id INT AUTO_INCREMENT PRIMARY KEY,

  -- Año del dato (ej: 2000, 2001)
  year INT NOT NULL,

  -- Código oficial SNIC del delito
  snic_code INT NOT NULL,

  -- Nombre oficial del delito
  snic_name VARCHAR(255) NOT NULL,

  -- Cantidad total de hechos registrados
  cantidad_hechos INT DEFAULT 0,

  -- Cantidad total de víctimas
  cantidad_victimas INT DEFAULT 0,

  -- Tasas oficiales
  tasa_hechos DECIMAL(10,4),
  tasa_victimas DECIMAL(10,4),

  -- Fuente del dataset
  source VARCHAR(100),

  -- Versión del dataset (para auditoría)
  dataset_version VARCHAR(50),

  -- Hash único para evitar duplicados
  hash CHAR(64) UNIQUE,

  -- Fecha de inserción
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
