const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const youtubeController = require("../controllers/youtubeController");

router.get("/youtube", requireAuth, (req, res) => youtubeController.page(req, res));
router.post("/youtube/favorites/add", requireAuth, (req, res) => youtubeController.add(req, res));
router.post("/youtube/favorites/remove", requireAuth, (req, res) => youtubeController.remove(req, res));

module.exports = router;
