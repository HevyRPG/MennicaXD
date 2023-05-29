const express = require('express');
const Currency = require('./backend/Models/Currency');
const CartItemModel = require('./backend/Models/CartItemModel');
const { CurrencyResponse, Rates } = require('./backend/Models/CurrencyResponse');
const CustomerOrder = require('./backend/Models/CustomerOrder');
const LoginModel = require('./backend/Models/LoginModel');
const OrderHistoryModel = require('./backend/Models/OrderHistoryModel');
const PlaceOrderModel = require('./backend/Models/PlaceOrderModel');
const ProductModel = require('./backend/Models/ProductModel');
const UserModel = require('./backend/Models/UserModel');
const Cart = require('./backend/Cart');
const Product = require('./backend/Product');
const UserLogin = require('./backend/UserLogin');

const app = express();


// Endpoint GET /test
app.get('/test', (req, res) => {
    res.send('Schludnie');
});

// Endpoint GET /test/curr
app.get('/test/curr', (req, res) => {
    const currency = UserLogin.SaveCurrency();
    res.send(currency);
});

// Endpoint POST /user/create
app.post('/user/create', (req, res) => {
    const model = req.body;
    const result = UserLogin.CreateUser(model);
    res.send(result);
});

// Endpoint POST /user/login
app.post('/user/login', (req, res) => {
    const model = req.body;
    const result = UserLogin.LoginUser(model);
    res.send(result);
});

// Endpoint POST /user/update
app.post('/user/update', (req, res) => {
    const model = req.body;
    const result = UserLogin.UpdateUser(model);
    res.send(result);
});

// Endpoint GET /products/:type
app.get('/products/:type', (req, res) => {
    const type = req.params.type;
    const products = Product.GetProducts(type);
    res.send(products);
});

// Endpoint GET /products
app.get('/products', (req, res) => {
    const products = Product.GetProducts();
    res.send(products);
});

// Endpoint POST /cart/add
app.post('/cart/add', (req, res) => {
    const model = req.body;
    Cart.AddToCart(model);
    res.send('Item added to cart');
});

// Endpoint POST /cart/remove
app.post('/cart/remove', (req, res) => {
    const model = req.body;
    Cart.RemoveFromCart(model);
    res.send('Item removed from cart');
});

// Endpoint GET /cart/:UserId
app.get('/cart/:UserId', (req, res) => {
    const userId = req.params.UserId;
    const cartItems = Cart.GetCartItems(userId);
    res.send(cartItems);
});

// Endpoint POST /order/placeOrder
app.post('/order/placeOrder', (req, res) => {
    const model = req.body;
    Product.PlaceOrder(model);
    res.send('Order placed');
});

// Endpoint GET /user/history/:UserId
app.get('/user/history/:UserId', (req, res) => {
    const userId = req.params.UserId;
    const orderHistory = Product.GetOrderHistory(userId);
    res.send(orderHistory);
});

// Endpoint POST /pay/:UserId/:OrderId
app.post('/pay/:UserId/:OrderId', (req, res) => {
    const userId = req.params.UserId;
    const orderId = req.params.OrderId;
    res.send('Order paid');
});

// Endpoint GET /currency
app.get('/currency', (req, res) => {
    const currency = Cart.ReturnCurrency();
    res.send(currency);
});

// Nasłuchiwanie na zdefiniowanym porcie
app.listen(3000, () => {
    console.log('Serwer nasłuchuje na porcie 3000');
});
