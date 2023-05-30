class CustomerOrder {
    constructor() {
        this._id = 0;
        this._userId = '';
        this._shippingCity = '';
        this._shippingPostalNumber = '';
        this._shippingCountry = '';
        this._shippingAddress = '';
        this._paymentId = 0;
        this._shippingMethodId = 0;
        this._price = 0.0;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get userId() {
        return this._userId;
    }

    set userId(value) {
        this._userId = value;
    }

    get shippingCity() {
        return this._shippingCity;
    }

    set shippingCity(value) {
        this._shippingCity = value;
    }

    get shippingPostalNumber() {
        return this._shippingPostalNumber;
    }

    set shippingPostalNumber(value) {
        this._shippingPostalNumber = value;
    }

    get shippingCountry() {
        return this._shippingCountry;
    }

    set shippingCountry(value) {
        this._shippingCountry = value;
    }

    get shippingAddress() {
        return this._shippingAddress;
    }

    set shippingAddress(value) {
        this._shippingAddress = value;
    }

    get paymentId() {
        return this._paymentId;
    }

    set paymentId(value) {
        this._paymentId = value;
    }

    get shippingMethodId() {
        return this._shippingMethodId;
    }

    set shippingMethodId(value) {
        this._shippingMethodId = value;
    }

    get price() {
        return this._price;
    }

    set price(value) {
        this._price = value;
    }
}

module.exports = CustomerOrder;
