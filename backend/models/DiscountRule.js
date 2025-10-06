const mongoose = require('mongoose');

const discountRuleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['BOGO', 'TWO_FOR_ONE', 'PERCENTAGE'],
    required: true
  },
  targetProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  targetCategory: {
    type: String,
    trim: true
  },
  percentage: {
    type: Number,
    min: 0,
    max: 100
  },
  minimumQuantity: {
    type: Number,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DiscountRule', discountRuleSchema);