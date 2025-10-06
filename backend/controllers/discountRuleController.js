const DiscountRule = require('../models/DiscountRule');

const discountRuleController = {
  // Get all discount rules
  getAllDiscountRules: async (req, res) => {
    try {
      const rules = await DiscountRule.find().populate('targetProduct');
      res.json({
        success: true,
        data: rules
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  },

  // Create new discount rule
  createDiscountRule: async (req, res) => {
    
  },

  // Update discount rule
  updateDiscountRule: async (req, res) => {
    
  },

  // Delete discount rule
  deleteDiscountRule: async (req, res) => {

  }
};

module.exports = discountRuleController;