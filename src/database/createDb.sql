-- Crear la base de datos
CREATE DATABASE tibia_database;
-- Usar la base de datos
USE tibia_database;
-- Crear la tabla "users"
CREATE TABLE users (
  user_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  -- otros campos de información de usuario (nombre, apellido, fecha de nacimiento, etc.)
  PRIMARY KEY (user_id)
);
-- Crear la tabla "characters"
CREATE TABLE characters (
  character_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  character_name VARCHAR(255) NOT NULL,
  nivel INT UNSIGNED NOT NULL,
  vocacion VARCHAR(255) NOT NULL,
  mundo VARCHAR(255) NOT NULL,
  -- otros campos de información de personaje (p. ej., fecha de creación, última vez que se conectó, etc.)
  PRIMARY KEY (character_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
-- Crear la tabla "hunt_sessions"
CREATE TABLE hunt_sessions (
  hunt_session_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  character_id INT UNSIGNED NOT NULL,
  fecha DATE NOT NULL,
  duracion INT UNSIGNED NOT NULL,
  monstruos_cazados INT UNSIGNED NOT NULL,
  experiencia_obtenida INT UNSIGNED NOT NULL,
  -- otros campos relevantes para la sesión de caza (p. ej., objetos obtenidos, tipo de caza, etc.)
  PRIMARY KEY (hunt_session_id),
  FOREIGN KEY (character_id) REFERENCES characters(character_id)
);
