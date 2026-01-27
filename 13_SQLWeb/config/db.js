const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "..", "db.sqlite");
const db = new sqlite3.Database(dbPath);

// helpers
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
}
function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}
function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

// init tables
(async () => {
  try {
    await run(`
      CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        fullName TEXT NOT NULL,
        passwordHash TEXT NOT NULL,
        createdAt TEXT NOT NULL
      )
    `);

    await run(`
      CREATE TABLE IF NOT EXISTS yt_favorites (
        user_id INTEGER NOT NULL,
        video_id TEXT NOT NULL,
        title TEXT NOT NULL,
        thumbnail_url TEXT,
        channel_title TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, video_id),
        FOREIGN KEY (user_id) REFERENCES Users(id)
      )
    `);
  } catch (e) {
    console.error("DB init error:", e.message);
  }
})();

module.exports = { db, run, get, all };
