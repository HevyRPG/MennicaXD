const axios = require('axios');
const express = require('express');
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
