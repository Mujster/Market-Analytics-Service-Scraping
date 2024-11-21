const mongoose = require('mongoose');

const agricultureProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number },
  unit: { type: String },
  price: { type: Number, required: true },
  image: [{ type: String, match: /^https?:\/\// }],
  weight: { type: Number, required: true },
  description: { type: String },
  ingredients: { type: String },
  type: { type: String },
  company: { type: String },
  deliveryCharges: { type: Number },
  url: { type: String, match: /^https?:\/\// },
  uploadedOn: { type: Date }
});


module.exports = mongoose.model('AgricultureProduct', agricultureProductSchema);