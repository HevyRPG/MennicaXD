class CurrencyResponse {
    constructor(table, no, effectiveDate, rates) {
        this.table = table;
        this.no = no;
        this.effectiveDate = effectiveDate;
        this.rates = rates;
    }
}

class Rates {
    constructor(currency, code, mid) {
        this.currency = currency;
        this.code = code;
        this.mid = mid;
    }
}

module.exports = { CurrencyResponse, Rates };