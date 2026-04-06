const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: String,
  cartId: String,
  cartItems: [
    {
      productId: String,
      title: String,
      image: String,
      price: String,
      quantity: Number,
    },
  ],
  addressInfo: {
    addressId: String,
    address: String,
    city: String,
    postalCode: String,
    phone: String,
  },
  orderStatus: String,
  paymentMethod: String,
  shippingMethod: String,
  shippingCost: Number,
  promoCode: String,
  promoDiscount: Number,
  paymentId: String,
  paymentStatus: String,
  totalAmount: Number,
  orderDate: Date,
  orderUpdateDate: Date,
});

module.exports = mongoose.model("Order", OrderSchema);
