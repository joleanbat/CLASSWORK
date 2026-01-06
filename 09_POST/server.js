const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// --- MIDDLEWARE ---
app.use(express.urlencoded({ extended: true }));

// --- [NEW] SPECIFIC ROUTE FOR HOMEPAGE ---
// This must be BEFORE express.static to override the default index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', '_index.html'));
});

// Serve other static files (CSS/JS)
app.use(express.static(path.join(__dirname, 'client')));

// --- ROUTES ---
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    // ... (keep the rest of your login logic same as before) ...
    if (password === "12345") {
        res.send(`<h1>Success!</h1>`); // Simplified for brevity
    } else {
        res.send(`<h1>Fail!</h1>`);
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});