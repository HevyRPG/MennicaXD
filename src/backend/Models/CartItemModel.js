class CartItemModel {
    constructor(productId, customerId, qty, lastUpdated = new Date(), currencyId) {
        this.productId = productId;
        this.customerId = customerId;
        this.qty = qty;
        this.lastUpdated = lastUpdated;
        this.currencyId = currencyId;
    }
}

module.exports = CartItemModel;
