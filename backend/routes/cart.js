const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/add', cartController.addToCart);
router.get('/summary', cartController.getCartSummary);
router.delete('/clear', cartController.clearCart);
router.delete('/remove/:productId', cartController.removeFromCart);
router.put('/update/:productId', cartController.updateCartItem);

module.exports = router;