const ytRepo = require("../repositories/ytFavoritesRepository");

async function searchYouTube(q) {
    const key = process.env.YT_API_KEY;
    if (!key) throw new Error("Missing YT_API_KEY in .env");

    const url =
        "https://www.googleapis.com/youtube/v3/search" +
        `?part=snippet&type=video&maxResults=12&q=${encodeURIComponent(q)}&key=${encodeURIComponent(key)}`;

    const resp = await fetch(url);
    const data = await resp.json();

    if (!resp.ok) throw new Error(data?.error?.message || "YouTube API error");

    return (data.items || []).map((it) => ({
        videoId: it.id.videoId,
        title: it.snippet.title,
        thumbnailUrl:
            it.snippet.thumbnails?.medium?.url ||
            it.snippet.thumbnails?.default?.url ||
            "",
        channelTitle: it.snippet.channelTitle || "",
    }));
}

async function getPageData(userId, q = "") {
    const favorites = await ytRepo.listByUser(userId);
    const results = q && q.trim() ? await searchYouTube(q.trim()) : [];
    return { favorites, results, q };
}

async function addFavorite(userId, payload) {
    await ytRepo.add(userId, payload);
}

async function removeFavorite(userId, videoId) {
    await ytRepo.remove(userId, videoId);
}

module.exports = { getPageData, addFavorite, removeFavorite };
