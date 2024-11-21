const mongoose = require('mongoose');

const priceListSchema = new mongoose.Schema({
  date: { type: Date },
  day: { type: String },
  city: { type: String },
  province: { type: String },
  minimumPrice: { type: Number },
  maximumPrice: { type: Number },
  productName: { type: String },
  type: { type: String },
  description: { type: String }
});

module.exports = mongoose.model('PriceList', priceListSchema);