use monitoreo_vecinal;
INSERT INTO locations (latitude, longitude, neighborhood) VALUES
(-34.6037, -58.3816, 'Microcentro'),
(-34.6158, -58.4333, 'Almagro'),
(-34.5880, -58.4306, 'Palermo'),
(-34.6265, -58.4300, 'Boedo'),
(-34.6407, -58.4009, 'Barracas');


SELECT * FROM monitoreo_vecinal;
SELECT * FROM locations;
INSERT INTO users (id, email, password_hash)
VALUES (1, 'juan@test.com', '1234');

SHOW COLUMNS FROM reports;