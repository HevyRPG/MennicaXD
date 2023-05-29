const { sql, ConnectionPool } = require('mssql');
const { LoginModel } = require('./Models/LoginModel');
const { CurrencyResponse } = require('./Models/CurrencyResponse');




const config = {
    server: '51.38.135.127,49170',
    database: 'Mennica',
    user: 'sa',
    password: 'Nie!Mam.Pomyslu#',
    options: {
        encrypt: true, // If you're using SSL encryption
        trustServerCertificate: false // If you're using a self-signed certificate
    }
};

async function createUser(model) {
    Membership.CreateUser(model.Username, model.Password, model.Email);

    const sql2 = 'SELECT UserId FROM aspnet_Users WHERE Username = @User';
    const parameters2 = {
        User: model.Username
    };

    const pool = new ConnectionPool(config);
    await pool.connect();

    const result = await pool.request()
        .input('User', sql.NVarChar, parameters2.User)
        .query(sql2);

    const UserId = result.recordset[0].UserId;

    const sql = 'INSERT INTO UserExtraInfo (UserId, Name, Surname, BirthDate) VALUES (@UserId, @Name, @Surname, @BirthDate)';
    const parameters = {
        UserId: UserId,
        Name: model.Name,
        Surname: model.Surname,
        BirthDate: model.BirthDate.toISOString().split('T')[0]
    };

    Roles.AddUserToRole(model.Username, 'User');

    await pool.request()
        .input('UserId', sql.NVarChar, parameters.UserId)
        .input('Name', sql.NVarChar, parameters.Name)
        .input('Surname', sql.NVarChar, parameters.Surname)
        .input('BirthDate', sql.Date, parameters.BirthDate)
        .query(sql);

    pool.close();
    return UserId;
}

function loginUser(model) {
    return Membership.ValidateUser(model.Username, model.Password);
}

async function updateUser(model) {
    const sql = `
    UPDATE u
    SET u.Name = @Name, u.BirthDate = @BirthDate, u.Surname = @Surname
    FROM UserExtraInfo u
    WHERE u.UserId = @UserId
  `;
    const parameters = {
        Name: model.Name,
        BirthDate: model.BirthDate.toISOString().split('T')[0],
        Surname: model.Surname,
        UserId: model.UserId
    };

    const pool = new ConnectionPool(config);
    await pool.connect();

    await pool.request()
        .input('Name', sql.NVarChar, parameters.Name)
        .input('BirthDate', sql.Date, parameters.BirthDate)
        .input('Surname', sql.NVarChar, parameters.Surname)
        .input('UserId', sql.NVarChar, parameters.UserId)
        .query(sql);

    pool.close();
    return true;
}

async function saveCurrency() {
    const pool = new ConnectionPool(config);
    await pool.connect();

    const result = await getCurrencyRates(pool);

    for (const rate of result.rates) {
        const sql = 'INSERT INTO Currency (currencyCode, currencyRate) VALUES (@code, @mid)';
        const parameters = {
            code: rate.code,
            mid: rate.mid
        };

        await pool.request()
            .input('code', sql.NVarChar, parameters.code)
            .input('mid', sql.Decimal(18, 6), parameters.mid)
            .query(sql);
    }

    pool.close();
}

async function getCurrencyRates(pool) {
    const url = 'http://api.nbp.pl/api/exchangerates/tables/A';
    const response = await fetch(url);
    const responseList = await response.json();
    const result = responseList[0];
    return result;
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    saveCurrency
};
