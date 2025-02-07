-- สร้างฐานข้อมูล
CREATE DATABASE IF NOT EXISTS Project_web_iot;

-- เลือกฐานข้อมูลที่สร้างขึ้น
USE Project_web_iot;

-- สร้างตาราง "user"
CREATE TABLE IF NOT EXISTS user (
    idUser INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE KEY,
    image LONGBLOB
);

-- สร้างตาราง "posts"
CREATE TABLE IF NOT EXISTS posts (
    postID INT AUTO_INCREMENT PRIMARY KEY,
    content varchar(255),
    Img LONGBLOB,
    postTime DATETIME NOT NULL,
    likes INT NOT NULL,
    amoutCM INT NOT NULL,
    IdUser INT,
    FOREIGN KEY (IdUser) REFERENCES user(idUser)
);

-- สร้างตาราง "comments"
CREATE TABLE IF NOT EXISTS comments (
    idComment INT AUTO_INCREMENT PRIMARY KEY,
    content VARCHAR(255) NOT NULL,
    commentTime DATETIME NOT NULL,
    postId INT,
    idUser INT,
    FOREIGN KEY (postId) REFERENCES posts(postID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (idUser) REFERENCES user(idUser) ON DELETE CASCADE ON UPDATE CASCADE
);

