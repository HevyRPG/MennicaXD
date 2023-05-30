class CurrencyResponse {
    constructor() {
        this._table = '';
        this._no = '';
        this._effectiveDate = '';
        this._rates = [];
    }

    get table() {
        return this._table;
    }

    set table(value) {
        this._table = value;
    }

    get no() {
        return this._no;
    }

    set no(value) {
        this._no = value;
    }

    get effectiveDate() {
        return this._effectiveDate;
    }

    set effectiveDate(value) {
        this._effectiveDate = value;
    }

    get rates() {
        return this._rates;
    }

    set rates(value) {
        this._rates = value;
    }
}

class Rates {
    constructor() {
        this._currency = '';
        this._code = '';
        this._mid = 0;
    }

    get currency() {
        return this._currency;
    }

    set currency(value) {
        this._currency = value;
    }

    get code() {
        return this._code;
    }

    set code(value) {
        this._code = value;
    }

    get mid() {
        return this._mid;
    }

    set mid(value) {
        this._mid = value;
    }
}

CurrencyResponse.Rates = Rates;

module.exports = CurrencyResponse;
