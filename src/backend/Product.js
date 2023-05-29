const { sql, ConnectionPool } = require('mssql');
const { ProductModel } = require('./Models/ProductModel');
const { PlaceOrderModel } = require('./Models/PlaceOrderModel');
const { OrderHistoryModel } = require('./Models/OrderHistoryModel');
const { CustomerOrder } = require('./Models/CustomerOrder');
const { CartItemModel } = require('./Models/CartItemModel');

const config = {
    server: '51.38.135.127,49170',
    database: 'Mennica',
    user: 'sa',
    password: 'Nie!Mam.Pomyslu#',
    options: {
        encrypt: true, // Jeśli używasz szyfrowania SSL
        trustServerCertificate: false // Jeśli korzystasz z niezaufanego certyfikatu SSL
    }
};

async function getProducts(type = null) {
    const pool = new ConnectionPool(config);
    await pool.connect();

    const query = `
    SELECT Id, Name, EAN, Price, Description, StockQty, InStock, Category, Type
    FROM Products
    WHERE (@type IS NULL OR Type = @type)
  `;
    const result = await pool.request()
        .input('type', sql.NVarChar, type)
        .query(query);

    pool.close();
    return result.recordset.map(record => new ProductModel(record));
}

async function placeOrder(model) {
    const pool = new ConnectionPool(config);
    await pool.connect();

    const query = `
    INSERT INTO CustomerOrder (UserId, ShippingCity, ShippingPostalNumber, ShippingCountry, ShippingAdress, PaymentId, ShippingMethodId, Price)
    VALUES (@UserId, @ShippingCity, @ShippingPostalNumber, @ShippingCountry, @ShippingAdress, @PaymentId, @ShippingMethodId, @Price)
  `;
    const parameters = {
        UserId: model.CustomerOrder.UserId,
        ShippingCity: model.CustomerOrder.ShippingCity,
        ShippingPostalNumber: model.CustomerOrder.ShippingPostalNumber,
        ShippingCountry: model.CustomerOrder.ShippingCountry,
        ShippingAdress: model.CustomerOrder.ShippingAdress,
        PaymentId: model.CustomerOrder.PaymentId,
        ShippingMethodId: model.CustomerOrder.ShippingMethodId,
        Price: model.CustomerOrder.Price
    };
    const result = await pool.request()
        .input('UserId', sql.NVarChar, parameters.UserId)
        .input('ShippingCity', sql.NVarChar, parameters.ShippingCity)
        .input('ShippingPostalNumber', sql.NVarChar, parameters.ShippingPostalNumber)
        .input('ShippingCountry', sql.NVarChar, parameters.ShippingCountry)
        .input('ShippingAdress', sql.NVarChar, parameters.ShippingAdress)
        .input('PaymentId', sql.Int, parameters.PaymentId)
        .input('ShippingMethodId', sql.Int, parameters.ShippingMethodId)
        .input('Price', sql.Float, parameters.Price)
        .query(query);

    const orderId = result.recordset[0].Id;
    const insertQuery = `
    INSERT INTO CustomerOrderItem (CustomerOrderId, ProductId, Qty)
    VALUES (@CustomerOrderId, @ProductId, @Qty)
  `;
    for (const cartItemModel of model.CartItemModel) {
        const insertParameters = {
            CustomerOrderId: orderId,
            ProductId: cartItemModel.ProductId,
            Qty: cartItemModel.Qty
        };
        await pool.request()
            .input('CustomerOrderId', sql.Int, insertParameters.CustomerOrderId)
            .input('ProductId', sql.NVarChar, insertParameters.ProductId)
            .input('Qty', sql.Int, insertParameters.Qty)
            .query(insertQuery);
    }

    pool.close();
}

async function getOrderHistory(UserId) {
    const pool = new ConnectionPool(config);
    await pool.connect();

    const orderQuery = `
    SELECT co.Id, co.UserId, co.ShippingCity, co.ShippingPostalNumber, co.ShippingCountry, co.ShippingAdress, co.PaymentId, co.ShippingMethodId, co.Price
    FROM CustomerOrder co
    WHERE UserId = @UserId
    ORDER BY Id DESC
  `;
    const orderParameters = {
        UserId: UserId
    };
    const orderResult = await pool.request()
        .input('UserId', sql.NVarChar, orderParameters.UserId)
        .query(orderQuery);

    const result = [];
    for (const order of orderResult.recordset) {
        const itemQuery = `
      SELECT coi.ProductId, coi.Qty
      FROM CustomerOrderItem coi
      WHERE coi.CustomerOrderId = @Id
    `;
        const itemParameters = {
            Id: order.Id
        };
        const itemResult = await pool.request()
            .input('Id', sql.Int, itemParameters.Id)
            .query(itemQuery);
        const productList = itemResult.recordset.map(record => new CartItemModel(record));

        result.push(new OrderHistoryModel({
            CustomerOrder: new CustomerOrder(order),
            CartItemModel: productList
        }));
    }

    pool.close();
    return result;
}

module.exports = {
    getProducts,
    placeOrder,
    getOrderHistory
};
