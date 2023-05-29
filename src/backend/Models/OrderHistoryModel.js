class OrderHistoryModel {
    constructor(customerOrder, cartItemModel) {
        this.customerOrder = customerOrder;
        this.cartItemModel = cartItemModel;
    }
}

module.exports = OrderHistoryModel;
