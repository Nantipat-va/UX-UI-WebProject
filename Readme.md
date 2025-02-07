# Project_Web_iot

## ขั้นตอนการสร้างฐานข้อมูล 

### 1.ไฟล์ `database.sql`
ภายในโฟลเดอร์ `UX-UI-WebProject-main` จะมีไฟล์ชื่อ `database.sql` ซึ่งเป็นไฟล์ SQL สำหรับสร้างฐานข้อมูล

-เปิดMySql command line ,Mysql workbench หรือ heidiSQL
-นำไฟล์ database.sql ไป import เข้าโปรแกรม

หลังจากนั้นให้สร้างฐานข้อมูล `project_web_iot` (หรือฐานข้อมูลที่คุณต้องการใช้) และนำไฟล์ SQL ที่มีไป import เข้าในฐานข้อมูล

### 2. การตั้งค่าการเชื่อมต่อฐานข้อมูลใน `server.js`

การกำหนดค่าการเชื่อมต่อฐานข้อมูลจะถูกตั้งค่าในไฟล์ `server.js` สามารถเข้าไปดูได้ตั้งแต่บรรทัดที่ 32 เป็นต้นไป:

```javascript
`
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'project_web_iot'
})
`
## ติดตั้งdependencies

--เปิด terminal หรือ command prompt 
-รันคำสั่ง `npm install`

จากนั้นสามารถใช้คำสั่ง 
npm run start 
เพื่อเปิดโปรเจคได้  โปรเจ็กต์จะเริ่มทำงานที่ `http://localhost:5000` (หรือพอร์ตที่ตั้งไว้ในโปรเจ็กต์)

### ข้อควรระวัง
1. ตรวจสอบให้แน่ใจว่าไฟล์ `database.sql` ถูกต้องและสามารถนำเข้าได้
2. หากฐานข้อมูลหรือการเชื่อมต่อไม่สามารถใช้งานได้, ลองตรวจสอบการตั้งค่าไฟล์ `.env` หรือ `server.js` อีกครั้ง



## ถ้าหากไม่สามารถ import ไฟล์ database.sql ได้ สามารถใช้ query นี้ในการสร้าง databaseได้

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

