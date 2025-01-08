const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  category: { type: String, required: false },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  imageUrl: { type: String, required: true },
});

module.exports = mongoose.model('Product', ProductSchema);
