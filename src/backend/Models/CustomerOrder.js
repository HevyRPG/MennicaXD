class CustomerOrder {
    constructor(id, userId, shippingCity, shippingPostalNumber, shippingCountry, shippingAddress, paymentId, shippingMethodId, price) {
        this.id = id;
        this.userId = userId;
        this.shippingCity = shippingCity;
        this.shippingPostalNumber = shippingPostalNumber;
        this.shippingCountry = shippingCountry;
        this.shippingAddress = shippingAddress;
        this.paymentId = paymentId;
        this.shippingMethodId = shippingMethodId;
        this.price = price;
    }
}

module.exports = CustomerOrder;
