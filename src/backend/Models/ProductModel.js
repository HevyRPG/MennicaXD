class ProductModel {
    constructor() {
        this._id = 0;
        this._name = '';
        this._ean = '';
        this._price = 0.0;
        this._description = '';
        this._stockQty = 0;
        this._inStock = false;
        this._category = 0;
        this._type = '';
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get ean() {
        return this._ean;
    }

    set ean(value) {
        this._ean = value;
    }

    get price() {
        return this._price;
    }

    set price(value) {
        this._price = value;
    }

    get description() {
        return this._description;
    }

    set description(value) {
        this._description = value;
    }

    get stockQty() {
        return this._stockQty;
    }

    set stockQty(value) {
        this._stockQty = value;
    }

    get inStock() {
        return this._inStock;
    }

    set inStock(value) {
        this._inStock = value;
    }

    get category() {
        return this._category;
    }

    set category(value) {
        this._category = value;
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }
}

module.exports = ProductModel;
