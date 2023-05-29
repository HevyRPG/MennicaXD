class UserModel {
    constructor(userId, username, password, email, birthDate, name, surname) {
        this.userId = userId;
        this.username = username;
        this.password = password;
        this.email = email;
        this.birthDate = birthDate;
        this.name = name;
        this.surname = surname;
    }
}

module.exports = UserModel;
