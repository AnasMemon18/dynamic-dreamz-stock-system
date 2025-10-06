const express = require('express');
const router = express.Router();
const discountRuleController = require('../controllers/discountRuleController');

router.get('/', discountRuleController.getAllDiscountRules);
router.post('/', discountRuleController.createDiscountRule);
router.put('/:id', discountRuleController.updateDiscountRule);
router.delete('/:id', discountRuleController.deleteDiscountRule);

module.exports = router;