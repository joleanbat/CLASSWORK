const express = require("express");
const session = require("express-session");
const cors = require("cors");
const path = require("path");

const app = express();

// 🔹 Serve client folder
app.use(express.static(path.join(__dirname, "../client")));

app.use(
    cors({
        origin: "http://127.0.0.1:3001",
        credentials: true
    })
);

app.use(
    session({
        secret: "mySecretKey123",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        }
    })
);

// 🔹 Home route → index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/index.html"));
});

// 🔹 API routes
app.get("/login/:name", (req, res) => {
    req.session.user = req.params.name;
    res.send("Logged in as " + req.session.user);
});

app.get("/dashboard", (req, res) => {
    if (req.session.user) {
        res.send("Hello " + req.session.user);
    } else {
        res.status(401).send("Not logged in");
    }
});

app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.send("Logged out");
    });
});

app.listen(3001, () => {
    console.log("Server running on http://127.0.0.1:3001");
});
