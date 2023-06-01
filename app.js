const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');

const app = express();
const port = 3000;
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";


// Start serwera

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
app.use(bodyParser.json());

let koszyk = []; // Przechowuje produkty w koszyku
let historiaZamowien = []; // Przechowuje historię zamówień
let users = []; // Przechowuje zarejestrowanych użytkowników


const produkty = [
    { produktId: 1, nazwa: 'Moneta złota', typ: 'złoto', rodzaj: 'monety', dostepny: true },
    { produktId: 2, nazwa: 'Moneta srebrna', typ: 'srebro', rodzaj: 'monety', dostepny: true },
    { produktId: 3, nazwa: 'Sztabka złota', typ: 'złoto', rodzaj: 'sztabki', dostepny: true },
    { produktId: 4, nazwa: 'Sztabka srebrna', typ: 'srebro', rodzaj: 'sztabki', dostepny: true },
];

// Funkcja do obliczania całkowitej ceny zamówienia
function obliczCeneZamowienia() {
    let sumaCen = 0;

    for (const produkt of koszyk) {
        sumaCen += produkt.cena * produkt.ilosc;
    }

    return sumaCen;
}

// Funkcja do weryfikacji dostępności produktu
function sprawdzDostepnoscProduktu(produktId) {
    const produkt = produkty.find(p => p.id === produktId);
    return produkt && produkt.dostepny;
}

// Endpoint dla dodawania produktu do koszyka
app.post('/cart/add', (req, res) => {
    const { productId, productQty } = req.body;

    axios.get('https://localhost:60608/products')
        .then(response => {
            const products = response.data;
            const product = products.find(p => p.id === productId);

            if (!product) {
                res.status(404).send('Produkt o podanym ID nie istnieje.');
            } else if (!product.inStock) {
                res.status(400).send('Produkt jest niedostępny.');
            } else {
                const pozycjaWKoszyku = koszyk.find(p => p.produktId === productId);

                if (pozycjaWKoszyku) {
                    pozycjaWKoszyku.ilosc += productQty;
                } else {
                    koszyk.push({ produktId: productId, ilosc: productQty });
                }

                res.send('Produkt został dodany do koszyka.');
            }
        })
        .catch(error => {
            console.error('Error fetching products:', error.response.data);
            res.sendStatus(500);
        });
});

// Endpoint dla usuwania produktu z koszyka
app.delete('/cart/remove/:productId', (req, res) => {
    const { productId } = req.params;

    const pozycjaWKoszyku = koszyk.find(p => p.produktId === Number(productId));

    if (!pozycjaWKoszyku) {
        res.status(404).send('Produkt o podanym ID nie istnieje w koszyku.');
    } else {
        koszyk = koszyk.filter(p => p.produktId !== Number(productId));
        res.send('Produkt został usunięty z koszyka.');
    }
});

// Endpoint dla aktualizacji ilości produktu w koszyku
app.put('/cart/update/:productId', (req, res) => {
    const { productId } = req.params;
    const { ilosc } = req.body;

    const pozycjaWKoszyku = koszyk.find(p => p.produktId === Number(productId));

    if (!pozycjaWKoszyku) {
        res.status(404).send('Produkt o podanym ID nie istnieje w koszyku.');
    } else {
        pozycjaWKoszyku.ilosc = ilosc;
        res.send('Ilość produktu w koszyku została zaktualizowana.');
    }
});

// Endpoint dla składania zamówienia
app.post('/zamowienie', async (req, res) => {
    const { miasto, kodPocztowy, ulica, numer, imie, nazwisko, metodaPlatnosci } = req.body;

    if (koszyk.length === 0) {
        res.status(400).send('Koszyk jest pusty. Nie można złożyć zamówienia.');
    } else {
        const numerZamowienia = historiaZamowien.length + 1;
        const cenaZamowienia = obliczCeneZamowienia();

        const noweZamowienie = {
            numer: numerZamowienia,
            data: new Date().toISOString(),
            cena: cenaZamowienia,
            produkty: [...koszyk],
            adres: {
                miasto,
                kodPocztowy,
                ulica,
                numer
            },
            daneKlienta: {
                imie,
                nazwisko
            },
            metodaPlatnosci
        };

        // Assuming your external API endpoint is '/api/placeOrder'
        const placeOrderUrl = 'https://localhost:60608/order/placeOrder';

        const placeOrderPayload = {
            CustomerOrder: {
                UserId: 1, // Replace with the actual user ID
                ShippingCity: miasto,
                ShippingPostalNumber: kodPocztowy,
                ShippingCountry: 'Your Country', // Replace with the actual shipping country
                ShippingAdress: ulica + ' ' + numer,
                PaymentId: 1, // Replace with the actual payment ID
                ShippingMethodId: 1, // Replace with the actual shipping method ID
                Price: 10.1  //cenaZamowienia
            },
            CartItemModel: koszyk.map((item) => ({
                ProductId: 1, //item.productId,
                CustomerId: 1, // Replace with the actual customer ID
                Qty: 1, //item.quantity,
                CurrencyId: 200// Replace with the actual currency ID
            }))
        };

        // try {
            // Make a POST request to the external API
            await axios.post(placeOrderUrl, placeOrderPayload);

            historiaZamowien.push(noweZamowienie);
            koszyk = []; // Wyczyszczenie koszyka po złożeniu zamówienia

            res.send('Zamówienie zostało złożone.');
        // } catch (error) {
        //     console.error('Błąd podczas składania zamówienia:', error);
        //     res.status(500).send('Wystąpił błąd podczas składania zamówienia.');
        // }
    }
});

// Endpoint dla żądania historii zamówień
app.get('/historia-zamowien/:idklienta', async (req, res) => {
    const userId = req.params.idklienta;
    const apiUrl = `https://localhost:60608/user/history/${userId}`;

    try {
        // Make a GET request to the external API
        const response = await axios.get(apiUrl);
        const historiaZamowien = response.data;

        res.send(historiaZamowien);
    } catch (error) {
        console.error('Błąd podczas pobierania historii zamówień:', error);
        res.status(500).send('Wystąpił błąd podczas pobierania historii zamówień.');
    }
});

// Endpoint dla ponownego składania zamówienia na podstawie zamówienia historycznego
app.post('/ponowne-zamowienie/:numerZamowienia', async (req, res) => {
    const { numerZamowienia } = req.params;

    const zamowienie = historiaZamowien.find(zam => zam.numer === Number(numerZamowienia));

    if (!zamowienie) {
        res.status(404).send('Zamówienie o podanym numerze nie zostało odnalezione.');
    } else {
        const noweZamowienie = { numer: generujNumerZamowienia(), produkty: [] };

        for (const produkt of zamowienie.produkty) {
            const dostepnoscProduktu = sprawdzDostepnoscProduktu(produkt.produktId);

            if (dostepnoscProduktu) {
                noweZamowienie.produkty.push(produkt);
            }
        }

        if (noweZamowienie.produkty.length > 0) {
            try {
                // Assuming your external API endpoint is '/api/placeOrder'
                const placeOrderUrl = 'https://localhost:60608/order/placeOrder';

                const placeOrderPayload = {
                    CustomerOrder: {
                        UserId: 1, // Replace with the actual user ID
                        ShippingCity: zamowienie.adres.miasto,
                        ShippingPostalNumber: zamowienie.adres.kodPocztowy,
                        ShippingCountry: 'Your Country', // Replace with the actual shipping country
                        ShippingAdress: zamowienie.adres.ulica + ' ' + zamowienie.adres.numer,
                        PaymentId: 1, // Replace with the actual payment ID
                        ShippingMethodId: 1, // Replace with the actual shipping method ID
                        Price: zamowienie.cena
                    },
                    CartItemModel: noweZamowienie.produkty.map((item) => ({
                        ProductId: item.productId,
                        CustomerId: 1, // Replace with the actual customer ID
                        Qty: item.quantity,
                        CurrencyId: 200 // Replace with the actual currency ID
                    }))
                };

                // Make a POST request to the external API
                await axios.post(placeOrderUrl, placeOrderPayload);

                historiaZamowien.push(noweZamowienie);
                res.send('Nowe zamówienie zostało złożone na podstawie zamówienia historycznego.');
            } catch (error) {
                console.error('Błąd podczas składania zamówienia:', error);
                res.status(500).send('Wystąpił błąd podczas składania zamówienia.');
            }
        } else {
            res.status(400).send('Produkty z zamówienia historycznego są niedostępne.');
        }
    }
});

// Endpoint dla tworzenia konta użytkownika DONEEE
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
// Endpoint dla logowania użytkownika // DONEE
app.post('/user/login', (req, res) => {
    const { Username, Password } = req.body;

    axios.post('https://localhost:60608/user/login', { Username, Password })
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch(error => {
            console.error('Error during login:', error.response.data);
            res.sendStatus(500);
        });
});


// Endpoint do modyfikacji danych DONEE
app.post('/user/update', (req, res) => {
    const { Name, BirthDate, Surname, UserId } = req.body;

    axios.post('https://localhost:60608/user/update', { Name, BirthDate, Surname, UserId })
        .then(response => {
            // Handle the successful update response from the API if needed
            res.sendStatus(200);
        })
        .catch(error => {
            console.error('Error updating user:', error.response.data);
            res.sendStatus(500);
        });
});


// Endpoint dla filtrowania dostępnego towaru DONEE
app.get('/products/:type', (req, res) => {
    const { type } = req.params;

    axios.get(`https://localhost:60608/products/${type}`)
        .then(response => {
            // Handle the successful response from the API if needed
            res.status(200).json(response.data);
        })
        .catch(error => {
            console.error('Error fetching currency:', error.response.data);
            res.sendStatus(500);
        });
});

