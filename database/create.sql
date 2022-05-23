/* /opt/lamp/bin/./mysql -u nom-usr -p base-dato < ./database/create.sql */

DROP DATABASE IF EXISTS plusLearnDev;
CREATE DATABASE IF NOT EXISTS plusLearnDev;

USE plusLearnDev;


CREATE TABLE User_Types (
    id INT(11) NOT NULL PRIMARY KEY,
    name VARCHAR(16) NOT NULL
);


CREATE TABLE Users(
    id INT(11) NOT NULL AUTO_INCREMENT,
    username VARCHAR(20) NOT NULL,
    password VARCHAR(80) NOT NULL,
    email VARCHAR(100) NOT NULL,
    userType_id INT(11),
    PRIMARY KEY(id, username),
    CONSTRAINT fk_user FOREIGN KEY (userType_id) REFERENCES User_Types(id)
);

CREATE TABLE Quizes (
    id INT(11) NOT NULL AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL,
    owner INT(11),
    PRIMARY KEY(id, name),
    CONSTRAINT fk_owner FOREIGN KEY (owner) REFERENCES Users(id)
);

CREATE TABLE Questions (
    id INT(11) NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    answer1 VARCHAR(25),
    answer2 VARCHAR(25),
    answer3 VARCHAR(25),
    answer4 VARCHAR(25),
    quiz_id INT(11),
    PRIMARY KEY(id, name),
    CONSTRAINT fk_quiz FOREIGN KEY (quiz_id) REFERENCES Quizes(id)
);

/* INSERT TESTING DATA  */
INSERT INTO User_Types VALUES (1, "Teacher");
INSERT INTO User_Types VALUES (2, "Student");

INSERT INTO Users VALUES (1, "teacherUserName", "password123", "userName@gmail.com", "1");
INSERT INTO Users VALUES (2, "studentUserName", "password321", "userName@gmail.com", "2");

INSERT INTO Quizes VALUES (1, "quizTestName", 1);

INSERT INTO Questions VALUES (1, "questionOne", "correctAnswer", "incorrectAnswer1", "incorrectAnswer2", "incorrectAnswer3", 1);