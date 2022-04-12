/* /opt/lamp/bin/./mysql -u nom-usr -p base-dato < ./database/create.sql */

DROP DATABASE IF EXISTS plusLearnDev;
CREATE DATABASE IF NOT EXISTS plusLearnDev;

USE plusLearnDev;


CREATE TABLE User_Types (
    id INT(11) NOT NULL PRIMARY KEY,
    name VARCHAR(16) NOT NULL
);


CREATE TABLE users(
    id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;,
    username VARCHAR(20) NOT NULL,
    password VARCHAR(80) NOT NULL,
    email VARCHAR(100) NOT NULL,
    userType_id INT(11),
    PRIMARY KEY(id, username)
    CONSTRAINT fk_user FOREIGN KEY (userType_id) REFERENCES User_Types(id)
);

/* INSERT TESTING DATA  */
INSERT INTO User_Types VALUES (1, "Teacher");
INSERT INTO User_Types VALUES (2, "Student");

INSERT INTO users VALUES ("teacherUserName", "password123", "userName@gmail.com", "1");
INSERT INTO users VALUES ("studentUserName", "password321", "userName@gmail.com", "2");