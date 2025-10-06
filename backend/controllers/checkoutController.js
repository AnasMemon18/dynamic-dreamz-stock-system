const Product = require('../models/Product');
const Cart = require('../models/Cart');

const checkoutController = {
  processCheckout: async (req, res) => {
    try {
      const cart = await Cart.findOne();
      
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ 
          success: false,
          error: 'Cart is empty' 
        });
      }

      const results = [];
      
      // Process each item in cart and update stock
      for (const item of cart.items) {
        const product = await Product.findById(item.productId);
        
        if (!product) {
          return res.status(404).json({ 
            success: false,
            error: `Product ${item.name} not found` 
          });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({ 
            success: false,
            error: `Insufficient stock for ${item.name}. Available: ${product.stock}, Requested: ${item.quantity}` 
          });
        }

        // Update stock
        product.stock -= item.quantity;
        await product.save();

        results.push({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          finalStock: product.stock
        });
      }

      // Clear cart after successful checkout
      cart.items = [];
      await cart.save();

      res.json({
        success: true,
        message: 'Checkout completed successfully',
        orderDetails: results,
        totalItems: results.reduce((sum, item) => sum + item.quantity, 0),
        totalAmount: results.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      });

    } catch (error) {
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }
};

module.exports = checkoutController;