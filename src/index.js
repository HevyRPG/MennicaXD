const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');

const app = express();
const port = 3000;
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});



axios.get('https://localhost:60608/test')
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        console.error(error);
    });

axios.get('https://localhost:60608/products/Silver')
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        console.error(error);
    });

axios.get('https://localhost:60608/products')
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        console.error(error);
    });

axios.get('https://localhost:60608/cart/4')
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        console.error(error);
    });

axios.get('https://localhost:60608/currency')
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        console.error(error);
    });




// Middleware
app.use(bodyParser.json());

// Database configuration
const dbConfig = {
    user: 'Hafy2',
    password: 'KujWDubie.1',
    server: '51.38.135.127',
    port:49170,
    database: 'Mennica',
    options: {
        encrypt: false, // Set to true if using Azure SQL
        trustServerCertificate: false // Set to true if using a self-signed certificate
    }
};

// Endpoint for creating a user
app.post('/user/create', (req, res) => {
    const { Username, Password, Email, BirthDate, Name, Surname } = req.body;

    const data = {
        Username,
        Password,
        Email,
        BirthDate,
        Name,
        Surname
    };

    axios.post('https://localhost:60608/user/create', data)
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch(error => {
            console.error('Error creating user:', error.response.data);
            res.sendStatus(500);
        });
});

app.get('/products', (req, res) => {
    axios.get('https://localhost:60608/products')
        .then(response => {
            const products = response.data; // Assuming the response contains an array of products

            // Extracting the IDs and StockQty
            const productData = products.map(products => ({ Id: products.Id, StockQty: products.StockQty }));

            res.status(200).json(productData);
        })
        .catch(error => {
            console.error('Error retrieving products:', error.response.data);
            res.sendStatus(500);
        });
});
