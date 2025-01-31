const express = require('express');
const http = require('http');
const mysql = require('mysql2');

const app = express();
const server = http.createServer(app);

const PORT = 5000;

app.use(express.json());

// create server
app.use(express.static(__dirname + '/public'));

app.get("/", (req, res) =>{
    res.sendFile(__dirname, "/public/index.html");
})

server.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
})

// connection database
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "project_web"
})

connection.connect((err) => {
    if(err) {
        console.error("Error connecting to MySQL", err);
        return;
    }

    console.log("Connected to MySQL Successfully!");
})

// 
app.post('/api/insert', (req, res) => {
    const {username, email, password} = req.body;

    const query = "INSERT INTO User(username, email, password) VALUES(?, ?, ?)";

    connection.query(query, [username, email, password], (err, results) => {
        if(err){
            console.err("Error inserting data: ",err);
            res.status(500).json({error: "Internal Server Error"});
        }

        res.json({
            msg: "Data inserted successfully",
            insertedId: results.insertedId
        })
    }
    )
})

app.post('/api/login', (req, res) =>{
    const {username, password } = req.body;

    if(!username || !password){
        return res.status(400).json({error: 'Username and password are required.'});
    }

    const query = "SELECT * FROM user WHERE username = ? AND password = ?";

    connection.query(query, [username, password], (err, results) => {
        if (err) {
            console.error("Error querying database: ", err);
            return res.status(500).json({ error: "Internal server error." });
        }

        if (results.length > 0) {
            res.status(200).json({ msg: "Login successful!", redirect: "/dashboard" });
        } else {
            res.status(401).json({ error: "Invalid username or password." });
        }
    });
})
app.get('/dashboard', (req, res) => {
    res.sendFile(__dirname + '/public/Html/main.html');
});