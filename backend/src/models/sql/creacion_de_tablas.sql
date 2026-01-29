
DROP DATABASE IF EXISTS monitoreo_vecinal;
create database monitoreo_vecinal;
use monitoreo_vecinal;
-- =========================
-- USUARIOS
-- =========================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('vecino', 'admin', 'operador') DEFAULT 'vecino',
    phone VARCHAR(30),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
-- REPORTES (TABLA CENTRAL)
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

