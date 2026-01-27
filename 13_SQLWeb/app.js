require("dotenv").config();

const express = require("express");
const path = require("path");

const sessionMiddleware = require("./config/session");
const authRoutes = require("./routes/authRoutes");
const youtubeRoutes = require("./routes/youtubeRoutes");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use(sessionMiddleware);

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

app.use(authRoutes);
app.use(youtubeRoutes);

// default open = login
app.get("/", (req, res) => res.redirect("/login"));

app.use((req, res) => res.status(404).send("Not Found"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
