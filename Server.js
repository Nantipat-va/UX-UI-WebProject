const express = require('express');
const http = require('http');
const mysql = require('mysql2');
const path = require('path');
const multer = require('multer');

//config multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage});

const app = express();
const server = http.createServer(app);

const PORT = 5000;

app.use(express.json());

// create server
app.use(express.static(__dirname + '/public'));

app.get("/", (req, res) =>{
    res.sendFile(__dirname + '/public/views/login.html');
})

server.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
})

// Create Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'project_web'
})

db.connect((error) => {
    if(error){
        console.log(error)
    } else{
        console.log('Database Connected');
    }
})



// Route สำหรับการ Register
app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // ตรวจสอบว่าอีเมลนี้มีในฐานข้อมูลหรือไม่
    const checkEmailQuery = "SELECT * FROM user WHERE email = ?";
    db.query(checkEmailQuery, [email], (err, results) => {
        if (err) {
            console.error("Error checking email:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (results.length > 0) {
            // หากพบว่าอีเมลซ้ำ
            return res.status(400).json({ error: "Email is already in use" });
        } else {
            // ถ้าไม่พบอีเมลซ้ำ ทำการ Insert ข้อมูลใหม่
            const query = "INSERT INTO user (username, email, password) VALUES (?, ?, ?)";
            db.query(query, [username, email, password], (err, results) => {
                if (err) {
                    console.error("Error registering user:", err);
                    return res.status(500).json({ error: "Internal Server Error" });
                }

                res.json({ msg: "Registration successful", insertedId: results.insertId });
            });
        }
    });
});

// Route สำหรับการ Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Please enter your Email and Password" });
    }

    const query = "SELECT * FROM user WHERE email = ? AND password = ?";
    db.query(query, [email, password], (err, results) => {
        if (err) {
            console.error("Error logging in:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (results.length > 0) {
            const user = results[0];
            res.json({ msg: "Login successfully", user: user });
        } else {
            res.status(401).json({ error: "Invalid email or password" });
        }
    });
});


// Route สำหรับการอัพโหลดรูปภาพ
app.post('/api/upload-image', upload.single('image'), (req, res) => {
    console.log("Received file:", req.file); // ตรวจสอบไฟล์ที่รับมา
    console.log("Received body:", req.body); // ตรวจสอบข้อมูล body ที่ส่งมา

    if (!req.file || !req.body.idUser) {  // ตรวจสอบ idUser แทน userId
        return res.status(400).json({ error: "No image or idUser provided" });
    }

    const idUser = req.body.idUser;
    const image = req.file.buffer; // ไฟล์รูปภาพในรูปแบบ Buffer

    // ตรวจสอบขนาดของไฟล์รูปภาพ
    if (image.length === 0) {
        return res.status(400).json({ error: "Uploaded image is empty" });
    }

    // สร้างคำสั่ง SQL เพื่ออัพเดตข้อมูลรูปภาพในฐานข้อมูล
    const query = "UPDATE user SET image = ? WHERE idUser = ?";
    db.query(query, [image, idUser], (err, results) => {
        if (err) {
            console.error("Error uploading image:", err);
            return res.status(500).json({ error: "Internal Server Error Image" });
        }

        res.json({ msg: "Image uploaded successfully", affectedRows: results.affectedRows });
    });
});


// API สำหรับดึงรูปภาพ
app.get('/api/get-image/:idUser', (req, res) => {
    const userId = req.params.idUser; // รับค่า idUser จาก URL

    const query = "SELECT image FROM user WHERE idUser = ?";
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error("Error fetching image:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (results.length === 0 || results[0].image === null) {
            // ถ้าไม่มีข้อมูลหรือ image เป็น null ให้ส่งรูปเริ่มต้น
            res.sendFile(__dirname, '/public/iconlike/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg'); // กำหนดเส้นทางไปยังรูปเริ่มต้น
        } else {
            const imageBuffer = results[0].image; // ดึงข้อมูลรูปภาพจากฐานข้อมูล

            res.contentType('image/png'); // กำหนดประเภทไฟล์ (หากรูปเป็น PNG)
            res.send(imageBuffer); // ส่งข้อมูลรูปกลับไป
        }
    });
});


