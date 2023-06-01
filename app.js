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
app.post('/zamowienie', (req, res) => {
    const { miasto, kodPocztowy, ulica, numerDomuMieszkania, imie, nazwisko, metodaPlatnosci } = req.body;

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
                numerDomuMieszkania
            },
            daneKlienta: {
                imie,
                nazwisko
            },
            metodaPlatnosci
        };
        //2. Punkt
        historiaZamowien.push(noweZamowienie);

        koszyk = []; // Wyczyszczenie koszyka po złożeniu zamówienia

        res.send('Zamówienie zostało złożone.');
    }
});

// Endpoint dla żądania historii zamówień
app.get('/historia-zamowien/idklienta', (req, res) => {
    res.send(historiaZamowien);
    //3,4 .punkt
});

// Endpoint dla ponownego składania zamówienia na podstawie zamówienia historycznego
app.post('/ponowne-zamowienie/:numerZamowienia', (req, res) => {
    const { numerZamowienia } = req.params;

    const zamowienie = historiaZamowien.find(zam => zam.numer === Number(numerZamowienia));

    if (!zamowienie) {
        res.status(404).send('Zamówienie o podanym numerze nie zostało odnalezione.');
    } else {
        for (const produkt of zamowienie.produkty) {
            const dostepnoscProduktu = sprawdzDostepnoscProduktu(produkt.produktId);

            if (dostepnoscProduktu) {
                koszyk.push(produkt);
            }
        }

        res.send('Nowe zamówienie zostało złożone na podstawie zamówienia historycznego.');
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

