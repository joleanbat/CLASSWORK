const youtubeService = require("../services/youtubeService");

class YoutubeController {
    async page(req, res) {
        try {
            const userId = req.session.user.id;
            const q = req.query.q || "";
            const data = await youtubeService.getPageData(userId, q);

            res.render("youtube", {
                title: "YouTube",
                q: data.q,
                results: data.results,
                favorites: data.favorites,
            });
        } catch (e) {
            console.error(e);
            res.status(500).send(e.message);
        }
    }

    async add(req, res) {
        try {
            const userId = req.session.user.id;
            const { videoId, title, thumbnailUrl, channelTitle, q } = req.body;

            await youtubeService.addFavorite(userId, { videoId, title, thumbnailUrl, channelTitle });

            res.redirect(q ? `/youtube?q=${encodeURIComponent(q)}` : "/youtube");
        } catch (e) {
            res.status(400).send(e.message);
        }
    }

    async remove(req, res) {
        try {
            const userId = req.session.user.id;
            const { videoId, q } = req.body;

            await youtubeService.removeFavorite(userId, videoId);

            res.redirect(q ? `/youtube?q=${encodeURIComponent(q)}` : "/youtube");
        } catch (e) {
            res.status(400).send(e.message);
        }
    }
}

module.exports = new YoutubeController();
