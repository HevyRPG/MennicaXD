class CartItemModel {
    constructor(productId, customerId, qty, lastUpdated = new Date(), currencyId) {
        this._productId = productId;
        this._customerId = customerId;
        this._qty = qty;
        this._lastUpdated = lastUpdated;
        this._currencyId = currencyId;
    }

    get productId() {
        return this._productId;
    }

    set productId(value) {
        this._productId = value;
    }

    get customerId() {
        return this._customerId;
    }

    set customerId(value) {
        this._customerId = value;
    }

    get qty() {
        return this._qty;
    }

    set qty(value) {
        this._qty = value;
    }

    get lastUpdated() {
        return this._lastUpdated;
    }

    set lastUpdated(value) {
        this._lastUpdated = value;
    }

    get currencyId() {
        return this._currencyId;
    }

    set currencyId(value) {
        this._currencyId = value;
    }
}

module.exports = CartItemModel;
