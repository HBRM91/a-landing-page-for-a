const mongoose = require('mongoose');

const pricingPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  features: {
    type: [String],
    default: []
  },
  popular: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('PricingPlan', pricingPlanSchema);