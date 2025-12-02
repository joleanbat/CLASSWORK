const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'client')));


const songs = [
    { id: 1, title: "Shape of You", artist: "Ed Sheeran" },
    { id: 2, title: "Blinding Lights", artist: "The Weeknd" },
    { id: 3, title: "Believer", artist: "Imagine Dragons" }
];

app.get("/api/songs", (req, res) => {
    res.json(songs);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/home.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/home.html'));
});

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/home.html'));
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

