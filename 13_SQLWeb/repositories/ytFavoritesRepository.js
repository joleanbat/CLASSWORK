const { run, all } = require("../config/db");

class YtFavoritesRepository {
    listByUser(userId) {
        return all(
            `SELECT * FROM yt_favorites WHERE user_id = ? ORDER BY created_at DESC`,
            [userId]
        );
    }

    add(userId, { videoId, title, thumbnailUrl, channelTitle }) {
        return run(
            `INSERT OR REPLACE INTO yt_favorites (user_id, video_id, title, thumbnail_url, channel_title)
       VALUES (?, ?, ?, ?, ?)`,
            [userId, videoId, title, thumbnailUrl || null, channelTitle || null]
        );
    }

    remove(userId, videoId) {
        return run(
            `DELETE FROM yt_favorites WHERE user_id = ? AND video_id = ?`,
            [userId, videoId]
        );
    }
}

module.exports = new YtFavoritesRepository();
