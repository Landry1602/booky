DROP TABLE IF EXISTS user;

CREATE TABLE user (
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  username VARCHAR(45) NOT NULL UNIQUE,
  email VARCHAR(50) NOT NULL UNIQUE,
  hashedPassword VARCHAR(64) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb3;

