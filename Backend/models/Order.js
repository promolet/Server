const { type } = require('@testing-library/user-event/dist/type');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Order Schema
const orderSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  orders: [
    {
      addressId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address', // Reference to the Address model
        required: true,
      },
      address:{
        type : String,
      },
  
      paymentOption: {
        type: String,
        required: true,
      },
      product: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AddProduct', // Reference to the Product model
            required: true,
          },
          productName:{
            type:String,
          },
          quantity: {
            type: Number,
            required: true,
          },
        },
      ],
      cartTotal: {
        type: Number,
        required: true,
      },
      shippingCost: {
        type: Number,
        required: true,
      },
      taxAmount: {
        type: Number,
        required: true,
      },
      totalAmount: {
        type: Number,
        required: true,
      },
      pointsBalance: {
        type: Number,
        default: 0,
      },
      walletBalance: {
        type: Number,
        default: 0,
      },
      razorpayOrderId:{ type:String,},
      razorpayPaymentId:{ type:String},
      status: { type: String, default: 'Pending' },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  
});

// Create and export the Order model
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
