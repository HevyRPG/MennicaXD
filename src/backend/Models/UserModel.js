class UserModel {
    constructor() {
        this._userId = '';
        this._username = '';
        this._password = '';
        this._email = '';
        this._birthDate = new Date();
        this._name = '';
        this._surname = '';
    }

    get userId() {
        return this._userId;
    }

    set userId(value) {
        this._userId = value;
    }

    get username() {
        return this._username;
    }

    set username(value) {
        this._username = value;
    }

    get password() {
        return this._password;
    }

    set password(value) {
        this._password = value;
    }

    get email() {
        return this._email;
    }

    set email(value) {
        this._email = value;
    }

    get birthDate() {
        return this._birthDate;
    }

    set birthDate(value) {
        this._birthDate = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get surname() {
        return this._surname;
    }

    set surname(value) {
        this._surname = value;
    }
}

module.exports = UserModel;
