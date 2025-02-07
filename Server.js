require('dotenv').config();

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
    database: 'project_web_iot'
})

db.connect((error) => {
    if(error){
        console.log(error)
    } else{
        console.log('Database Connected');
    }
})



// API สำหรับการ Register
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

// API สำหรับการ Login
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


// API สำหรับการอัพโหลดรูปภาพ
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


//API การอัปเดทข้อมูล
app.post('/api/update-user-info', (req, res) => {
    const { idUser, username, email, password } = req.body;

    // ตรวจสอบว่าอีเมลซ้ำหรือไม่ (ยกเว้นของตัวเอง)
    const checkEmailQuery = "SELECT * FROM user WHERE email = ? AND idUser != ?";
    db.query(checkEmailQuery, [email, idUser], (err, results) => {
        if (err) {
            console.error("Error checking email:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (results.length > 0) {
            // หากพบว่าอีเมลซ้ำ
            return res.status(400).json({ error: "Email is already in use" });
        } else {
            // อัปเดตข้อมูล
            const query = "UPDATE user SET username = ?, email = ?, password = ? WHERE idUser = ?";
            db.query(query, [username, email, password, idUser], (err, results) => {
                if (err) {
                    console.error("Error updating user:", err);
                    return res.status(500).json({ error: "Internal Server Error" });
                }

                // ตรวจสอบว่าได้อัปเดตข้อมูลหรือไม่
                if (results.affectedRows > 0) {
                    const user = results[0];

                    res.json({ msg: "Update successful", user: user });
                } else {
                    res.status(400).json({ error: "No changes made to user information" });
                }
            });
        }
    });
});

//API addpost
app.post('/api/addpost', upload.single('image'), (req, res) => {
    const { text, postTime, likes, comments, idUser } = req.body;
    const image = req.file ? req.file.buffer : null;  // Get the image from the uploaded file

    // ตรวจสอบว่าได้รับข้อมูลที่จำเป็นครบหรือไม่
    if (!postTime || !idUser) {
        return res.status(400).json({ error: "Please share your mind" });
    }

    // ถ้าไม่มีข้อความ แต่มีภาพ
    if (!text && !image) {
        return res.status(400).json({ error: "Post requires either text or an image" });
    }

    // Query SQL สำหรับการเพิ่มโพสต์พร้อมเก็บข้อมูลภาพ
    const query = "INSERT INTO posts (content, postTime, likes, amoutCM, IdUser, Img) VALUES (?, ?, ?, ?, ?, ?)";
    const params = [text || null, postTime, likes, comments, idUser, image || null];

    db.query(query, params, (err, results) => {
        if (err) {
            console.error("Error Posting:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        res.json({ msg: "Post successfully", post: results.insertId });
    });
});

//API ดึงข้อมูลโพสต์ออกมาแสดง
app.get('/api/posts', (req, res) => {
    const query = "SELECT * FROM posts INNER JOIN user ON user.idUser = posts.IdUser ORDER BY postTime DESC";

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching posts:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        // แปลง BLOB ของ Img เป็น Base64
        results.forEach(post => {
            if (post.Img) {
                post.Img = `data:image/jpeg;base64,${post.Img.toString('base64')}`;
            }
        });

        res.json(results);
    });
});

// API สำหรับดึงรูปภาพโปรไฟล์ผู้ใช้
app.get('/api/user-image/:idUser', (req, res) => {
    const userId = req.params.idUser;
    const query = "SELECT image FROM user WHERE idUser = ?";

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error("Error fetching image:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (results.length === 0 || !results[0].image) {
            res.sendFile(`${__dirname}/public/default-profile.png`);
        } else {
            res.contentType('image/jpeg');
            res.send(results[0].image);
        }
    });
});


// API สำหรับเพิ่มคอมเมนต์
app.post('/api/comments', (req, res) => {
    console.log(req.body); // ตรวจสอบค่าที่ส่งมาจาก client
    const { content, commentTime, postId, idUser } = req.body;

    const query = "INSERT INTO comments (content, commentTime, postId, idUser) VALUES (?, ?, ?, ?)";
    const values = [content, commentTime, postId, idUser];

    db.query(query, values, (err, results) => {
        if (err) {
            console.error("Error inserting comment:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        res.status(201).json({ message: "Comment added successfully", commentId: results.insertId });
    });
});

// API สำหรับดึงคอมเมนต์ของโพสต์
app.get('/api/comments/:postId', (req, res) => {
    const postId = req.params.postId;

    // คำสั่ง SQL ที่จะดึงคอมเมนต์ทั้งหมดที่เกี่ยวข้องกับ postId พร้อมกับดึง username จาก user
    const query = `
        SELECT *
        FROM comments
        INNER JOIN user ON comments.idUser = user.idUser
        WHERE comments.postId = ?
        ORDER BY comments.commentTime DESC
    `;

    db.query(query, [postId], (err, results) => {
        if (err) {
            console.error("Error fetching comments:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        // ส่งผลลัพธ์กลับไปเป็น JSON
        res.json(results);
    });
});


// API สำหรับอัปเดตโพสต์
app.post('/api/update-post', (req, res) => {
    const { postId, content } = req.body;

    const query = "UPDATE posts SET content = ? WHERE postID = ?";
    const values = [content, postId];

    db.query(query, values, (err, results) => {
        if (err) {
            console.error("Error updating post:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        res.status(200).json({ message: "Post updated successfully" });
    });
});

app.delete('/api/delete-post/:postId', (req, res) => {
    const postId = req.params.postId;

    const query = "DELETE FROM posts WHERE postID = ?";
    db.query(query, [postId], (err, results) => {
        if (err) {
            console.error("Error deleting post:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        // ตรวจสอบว่าพบโพสต์ที่ลบหรือไม่
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Post not found" });
        }

        res.status(200).json({ message: "Post deleted successfully" });
    });
});

app.put('/api/update-comment/:commentId', (req, res) => {
    const commentId = req.params.commentId;
    const { comment } = req.body;

    if (!comment) {
        return res.status(400).json({ error: 'Comment content is required' });
    }

    const query = "UPDATE comments SET content = ? WHERE idComment = ?";
    db.query(query, [comment, commentId], (err, results) => {
        if (err) {
            console.error("Error updating comment:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Comment not found" });
        }

        res.status(200).json({ message: "Comment updated successfully" });
    });
});

app.delete('/api/delete-comment/:commentId', (req, res) => {
    const commentId = req.params.commentId;

    const query = "DELETE FROM comments WHERE idComment = ?";
    db.query(query, [commentId], (err, results) => {
        if (err) {
            console.error("Error deleting comment:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Comment not found" });
        }

        res.status(200).json({ message: "Comment deleted successfully" });
    });
});




