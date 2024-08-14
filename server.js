const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt=require('bcrypt');
const path = require("path");

const app = express();
// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// MySQL connection
const db = mysql.createConnection({
    host: 'database-2.ctkw046yyrnq.ap-south-1.rds.amazonaws.com',
    user: 'admin',
    password: 'Arpita123',
    database: 'mydb'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

// Serve the login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'/index.html'));
});

// Handle login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM login WHERE user = ?';
    db.query(query, [username], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            const user = results[0];

            // Simple comparison of plain text passwords
            if (password === user.pass) {
                res.send('Login successful!');
            } else {
                res.send('Invalid username or password');
            }
        } else {
            res.send('Invalid username or password');
        }
    });
});


const port = 8080;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
