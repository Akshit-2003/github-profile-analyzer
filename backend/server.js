const express = require('express');
const axios = require('axios');
const db = require('./db'); 
require('dotenv').config();

const app = express();
// Automatically create table if it doesn't exist
db.execute(`
    CREATE TABLE IF NOT EXISTS profiles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255),
        public_repos INT DEFAULT 0,
        followers INT DEFAULT 0,
        following INT DEFAULT 0,
        profile_url VARCHAR(255),
        bio TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`).then(() => console.log("Database table is ready!"))
  .catch(err => console.error("Table creation error:", err));
app.use(express.json());
// Base route for browser testing
app.get('/', (req, res) => {
    res.send("Welcome to GitHub Profile Analyzer API! API is running perfectly.");
});

// API 1: 
app.post('/api/analyze/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const response = await axios.get(`https://api.github.com/users/${username}`);
        const { login, name, public_repos, followers, following, html_url, bio } = response.data;

        const sql = `
            INSERT INTO profiles (username, name, public_repos, followers, following, profile_url, bio)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            name = VALUES(name), public_repos = VALUES(public_repos), 
            followers = VALUES(followers), following = VALUES(following), bio = VALUES(bio)
        `;
        
        await db.execute(sql, [login, name, public_repos, followers, following, html_url, bio]);

        res.status(201).json({ message: "Profile saved successfully!", data: { username: login, public_repos, followers } });
    } catch (error) {
        if (error.response && error.response.status === 404) return res.status(404).json({ error: "GitHub user not found!" });
        res.status(500).json({ error: "Server Error" });
    }
});

// API 2: 
app.get('/api/profiles', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM profiles ORDER BY created_at DESC');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error fetching profiles" });
    }
});

// API 3: Kisi ek specific user ki profile dekho
app.get('/api/profiles/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const [rows] = await db.execute('SELECT * FROM profiles WHERE username = ?', [username]);
        if (rows.length === 0) return res.status(404).json({ error: "Profile not found in DB" });
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error fetching profile" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} 🌐`);
});