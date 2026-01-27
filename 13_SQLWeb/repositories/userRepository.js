const { get, run } = require("../config/db");
const User = require("../models/user");

class UserRepository {
    async findByEmail(email) {
        const row = await get(`SELECT * FROM Users WHERE email = ?`, [email]);
        return row ? new User(row) : null;
    }

    async findById(id) {
        const row = await get(`SELECT * FROM Users WHERE id = ?`, [id]);
        return row ? new User(row) : null;
    }

    async create({ email, fullName, passwordHash }) {
        const createdAt = new Date().toISOString();
        const result = await run(
            `INSERT INTO Users (email, fullName, passwordHash, createdAt) VALUES (?, ?, ?, ?)`,
            [email, fullName, passwordHash, createdAt]
        );

        return new User({
            id: result.lastID,
            email,
            fullName,
            passwordHash,
            createdAt,
        });
    }
}

module.exports = new UserRepository();
