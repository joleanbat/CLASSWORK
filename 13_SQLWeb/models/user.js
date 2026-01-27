class User {
    constructor(row) {
        this.id = row.id;
        this.email = row.email;
        this.fullName = row.fullName;
        this.passwordHash = row.passwordHash;
        this.createdAt = row.createdAt;
    }
}
module.exports = User;
