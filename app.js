const express = require('express');
const app = express();
app.use(express.json());

let koszyk = []; // Przechowuje produkty w koszyku
let historiaZamowien = []; // Przechowuje historię zamówień

// Endpoint dla dodawania produktu do koszyka
app.post('/koszyk', (req, res) => {
    const { produkt } = req.body;
    koszyk.push(produkt);
    res.send('Produkt został dodany do koszyka.');
});

// Endpoint dla składania zamówienia
app.post('/zamowienie', (req, res) => {
    const { miasto, kodPocztowy, ulica, numer, imie, nazwisko, platnosc } = req.body;

    if (koszyk.length === 0) {
        res.status(400).send('Koszyk jest pusty. Nie można złożyć zamówienia.');
    } else if (!miasto || !kodPocztowy || !ulica || !numer || !imie || !nazwisko || !platnosc) {
        res.status(400).send('Nie wszystkie wymagane dane zostały podane.');
    } else {
        const zamowienie = {
            numer: historiaZamowien.length + 1,
            data: new Date(),
            cena: obliczCeneZamowienia(),
            produkty: [...koszyk],
            adres: {
                miasto,
                kodPocztowy,
                ulica,
                numer
            },
            klient: {
                imie,
                nazwisko
            },
            platnosc
        };

        // Tutaj można dodać dodatkową logikę przetwarzania zamówienia, np. zapis do bazy danych

        // Dodaj zamówienie do historii zamówień
        historiaZamowien.push(zamowienie);

        let wiadomosc = 'Zamówienie zostało złożone.' + "\r\n";

        if (platnosc === 'przelew') {
            // Logika dla tradycyjnego przelewu
            wiadomosc += 'Wykonaj przelew na numer konta: XYZ.' + "\r\n";
        } else if (platnosc === 'payu') {
            // Logika dla płatności za pomocą PayU
            wiadomosc += ' Zapłać za zamówienie za pomocą PayU.' + "\r\n";
        }

        // Wyczyść koszyk po złożeniu zamówienia
        koszyk = [];

        wiadomosc +='Koszyk został wyczyszczony'

        res.send(wiadomosc);
    }
});

// Endpoint dla przeglądania historii zamówień
app.get('/historia', (req, res) => {
    res.send(historiaZamowien);
});

// Endpoint dla ponownego zamówienia
app.post('/ponowne-zamowienie/:numerZamowienia', (req, res) => {
    const numerZamowienia = parseInt(req.params.numerZamowienia);

    const zamowienie = historiaZamowien.find(zam => zam.numer === numerZamowienia);

    if (!zamowienie) {
        res.status(402).send('Nie znaleziono zamówienia o podanym numerze.');
    } else {
        // Dodaj produkty zamówienia do koszyka
        koszyk = [...zamowienie.produkty];

        res.send('Produkty zamówienia zostały dodane do koszyka.');
    }
});

app.listen(3001, () => {
    console.log('Aplikacja działa na porcie 3000!');
});

// Funkcja do obliczania całkowitej ceny zamówienia
function obliczCeneZamowienia() {
    let sumaCen = 0;

    for (const produkt of koszyk) {
        sumaCen += produkt.cena * produkt.ilosc;
    }

    return sumaCen;
}
