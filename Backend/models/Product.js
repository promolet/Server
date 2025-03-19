const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    brand: { type: String, required: true }, // Brand of the product
    model: { type: String }, // Model of the product
    partCode: { type: String }, // Unique part code
    capacity: { type: Number, required: true }, // Capacity value
    capacityUnits: { type: String, required: true }, // Units for the capacity
    typeOfUnit: { type: String, required: true }, // Type of the unit
    phase: { type: String, required: true }, // Phase (e.g., single-phase, three-phase)
    ratedVoltage: { type: Number, required: true }, // Rated voltage in volts
    stock: { type: Number }, // Quantity in stock
    sku: { type: String }, // Unique Stock Keeping Unit
    images: { type: [String], required: true }, // Array to store multiple image URLs
  },
  { timestamps: true } // Add timestamps for createdAt and updatedAt
);

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;