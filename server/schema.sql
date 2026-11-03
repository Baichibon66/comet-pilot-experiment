-- Import in phpMyAdmin after choosing / creating a UTF8MB4 database.
CREATE TABLE IF NOT EXISTS comet_sessions (
 session_id CHAR(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL PRIMARY KEY,
 experiment_version VARCHAR(24) NOT NULL,
 language VARCHAR(4) NOT NULL,
 sequence_id TINYINT UNSIGNED NOT NULL,
 started_at VARCHAR(40) NOT NULL,
 ended_at VARCHAR(40) NOT NULL,
 complete TINYINT(1) NOT NULL,
 payload LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
 received_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CHECK (JSON_VALID(payload)),
 INDEX idx_received_at (received_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
