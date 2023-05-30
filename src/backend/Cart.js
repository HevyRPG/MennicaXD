const sql = require('mssql');
const { Currency } = require('./Models/Currency');

const config = {
    server: '<your-server>',
    database: '<your-database>',
    user: '<your-username>',
    password: '<your-password>',
    options: {
        trustedConnection: false
    }
};

async function connectToDatabase() {
    try {
        await sql.connect(config);
        console.log('Connected to the database');
        // Perform database operations here
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}

connectToDatabase();

async function addToCart(item) {
    try {
        const pool = await sql.connect(config);
        const query =
            'INSERT INTO CartItems (productid, customerid, qty, lastupdated, currencyid) VALUES (@ProductId, @CustomerId, @Qty, @LastUpdated, @CurrencyId)';
        const result = await pool.request()
            .input('ProductId', sql.VarChar, item.ProductId)
            .input('CustomerId', sql.VarChar, item.CustomerId)
            .input('Qty', sql.Int, item.Qty)
            .input('LastUpdated', sql.DateTime, new Date())
            .input('CurrencyId', sql.Int, item.CurrencyId)
            .query(query);

        sql.close();
    } catch (error) {
        console.error('Error adding item to cart:', error);
    }
}

async function removeFromCart(item) {
    try {
        const pool = await sql.connect(config);
        const query = 'DELETE FROM CartItems WHERE CustomerId = @CustomerId AND ProductId = @ProductId';
        const result = await pool.request()
            .input('ProductId', sql.VarChar, item.ProductId)
            .input('CustomerId', sql.VarChar, item.CustomerId)
            .query(query);

        sql.close();
    } catch (error) {
        console.error('Error removing item from cart:', error);
    }
}

async function returnCurrency() {
    try {
        const pool = await sql.connect(config);
        const query = 'SELECT currencyCode, currencyRate FROM Currency';
        const result = await pool.request().query(query);
        const currencies = result.recordset.map(record => new Currency(record.currencyCode, record.currencyRate));

        sql.close();
        return currencies;
    } catch (error) {
        console.error('Error retrieving currencies:', error);
        return [];
    }
}

async function getCartItems(UserId) {
    try {
        const pool = await sql.connect(config);
        const query = 'SELECT * FROM CartItems WHERE CustomerId = @UserId';
        const result = await pool.request()
            .input('UserId', sql.VarChar, UserId)
            .query(query);

        sql.close();
        return result.recordset;
    } catch (error) {
        console.error('Error retrieving cart items:', error);
        return [];
    }
}

module.exports = {
    addToCart,
    removeFromCart,
    returnCurrency,
    getCartItems
};
