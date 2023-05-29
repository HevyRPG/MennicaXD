class ProductModel {
    constructor(id, name, ean, price, description, stockQty, inStock, category, type) {
        this.id = id;
        this.name = name;
        this.ean = ean;
        this.price = price;
        this.description = description;
        this.stockQty = stockQty;
        this.inStock = inStock;
        this.category = category;
        this.type = type;
    }
}

module.exports = ProductModel;
