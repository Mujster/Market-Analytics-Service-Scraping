const mongoose = require('mongoose');

const liveStockSchema = new mongoose.Schema({
  age: { type: Number },
  animal: { type: String },
  location: { type: String },
  updateDate: { type: Date },
  name: { type: String },
  category: { type: String },
  description: { type: String },
  media: [{ type: String, match: /^https?:\/\// }],
  minLiveWeight: { type: Number },
  maxLiveWeight: { type: Number },
  breed: { type: String },
  quantity: { type: Number },
  url: { type: String, match: /^https?:\/\// },
  gender: { type: String },
  pregnant: { type: Boolean },
  teethCount: { type: Number }
});

module.exports = mongoose.model('LiveStock', liveStockSchema);