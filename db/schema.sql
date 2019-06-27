CREATE DATABASE tranquil_db;

USE tranquil_db;

CREATE TABLE user_info
(
    id INT
    AUTO_INCREMENT NOT NULL,
    username VARCHAR
    (30),
    password VARCHAR(45),
    name VARCHAR(45),
    score INT (10),
    PRIMARY KEY (id)
);

CREATE TABLE data_output
(
    id INT
    AUTO_INCREMENT NOT NULL,
    video_url VARCHAR(45),
    category VARCHAR(45),
    score1 INT(10),
    score2 INT(10),
    PRIMARY KEY (id)
);