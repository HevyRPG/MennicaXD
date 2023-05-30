class Currency {
    constructor(currencyCode, currencyRate) {
        this._currencyCode = currencyCode;
        this._currencyRate = currencyRate;
    }

    get currencyCode() {
        return this._currencyCode;
    }

    set currencyCode(value) {
        this._currencyCode = value;
    }

    get currencyRate() {
        return this._currencyRate;
    }

    set currencyRate(value) {
        this._currencyRate = value;
    }
}

module.exports = Currency;
