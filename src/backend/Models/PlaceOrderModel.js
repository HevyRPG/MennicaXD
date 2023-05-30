class PlaceOrderModel {
    constructor() {
        this._customerOrder = null;
        this._cartItems = [];
    }

    get customerOrder() {
        return this._customerOrder;
    }

    set customerOrder(value) {
        this._customerOrder = value;
    }

    get cartItems() {
        return this._cartItems;
    }

    set cartItems(value) {
        this._cartItems = value;
    }
}

module.exports = PlaceOrderModel;
