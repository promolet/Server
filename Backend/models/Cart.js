const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // References the User model
  products: [
    {
      productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
      }, // References the Product model
      quantity: { 
        type: Number, 
        required: true, 
        default: 1, 
        min: 1 // Ensures the quantity is at least 1
      }, // Quantity of the product in the cart
    },
  ],
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
