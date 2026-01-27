const bcrypt = require("bcrypt");
const userRepo = require("../repositories/userRepository");

class AuthService {
    async register({ email, fullName, password }) {
        if (!email || !fullName || !password) throw new Error("Missing fields");

        const exists = await userRepo.findByEmail(email);
        if (exists) throw new Error("Email already exists");

        const passwordHash = await bcrypt.hash(password, 10);
        return userRepo.create({ email, fullName, passwordHash });
    }

    async login({ email, password }) {
        if (!email || !password) throw new Error("Missing fields");

        const user = await userRepo.findByEmail(email);
        if (!user) throw new Error("Invalid email or password");

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) throw new Error("Invalid email or password");

        return user;
    }
}

module.exports = new AuthService();
