const { all, run } = require("../config/db");

async function listFavoritesByUser(userId) {
    return all(
        `SELECT m.id, m.title, m.year, m.genre, f.created_at
     FROM favorites f
     JOIN movies m ON m.id = f.movie_id
     WHERE f.user_id = ?
     ORDER BY f.created_at DESC`,
        [userId]
    );
}

async function addFavorite(userId, movieId) {
    // ignore duplicates because PK(user_id, movie_id)
    return run(
        `INSERT OR IGNORE INTO favorites (user_id, movie_id) VALUES (?, ?)`,
        [userId, movieId]
    );
}

async function removeFavorite(userId, movieId) {
    return run(
        `DELETE FROM favorites WHERE user_id = ? AND movie_id = ?`,
        [userId, movieId]
    );
}

module.exports = { listFavoritesByUser, addFavorite, removeFavorite };
