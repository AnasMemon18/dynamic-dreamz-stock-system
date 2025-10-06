const Cart = require('../models/Cart');
const Product = require('../models/Product');
const DiscountRule = require('../models/DiscountRule');

// get cart function from database
const getSingleCart = async () => {
  let cart = await Cart.findOne();
  if (!cart) {
    cart = new Cart({ 
      items: [] 
    });
    await cart.save();
  }
  return cart;
};

const cartController = {
  // Add item to the cart
  addToCart: async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ 
          success: false,
          error: 'Product not found' 
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({ 
          success: false,
          error: 'Insufficient stock' 
        });
      }

      const cart = await getSingleCart();

      // Check if product already in cart
      const existingItemIndex = cart.items.findIndex(
        item => item.productId.toString() === productId
      );

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item to cart
        cart.items.push({
          productId,
          name: product.name,
          price: product.price,
          quantity,
          category: product.category
        });
      }

      await cart.save();

      res.json({ 
        success: true,
        message: 'Product added to cart', 
        cart: cart.items 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  },

  // Get cart summary with discounts
  getCartSummary: async (req, res) => {
    try {
      const cart = await getSingleCart();
      const discountRules = await DiscountRule.find({ isActive: true }).populate('targetProduct');
      
      let total = 0;
      let discountApplied = false;
      const discountDetails = [];

      // Calculate total without discounts
      cart.items.forEach(item => {
        total += item.price * item.quantity;
      });

      // Apply discount rules
      for (const item of cart.items) {
        const productDiscounts = discountRules.filter(rule => 
          rule.targetProduct?._id?.toString() === item.productId.toString() || 
          rule.targetCategory === item.category
        );

        for (const rule of productDiscounts) {
          let discountAmount = 0;
          let discountDescription = '';

          switch (rule.type) {
            case 'BOGO':
              if (item.quantity >= rule.minimumQuantity) {
                const freeItems = Math.floor(item.quantity / 2);
                discountAmount = freeItems * item.price;
                discountDescription = `-${discountAmount} (BOGO - ${freeItems} free)`;
              }
              break;

            case 'TWO_FOR_ONE':
              if (item.quantity >= rule.minimumQuantity) {
                const paidItems = Math.ceil(item.quantity / 2);
                discountAmount = (item.quantity - paidItems) * item.price;
                discountDescription = `-${discountAmount} (2 for 1)`;
              }
              break;

            case 'PERCENTAGE':
              discountAmount = (item.price * item.quantity * rule.percentage) / 100;
              discountDescription = `-${discountAmount} (${rule.percentage}% off)`;
              break;
          }

          if (discountAmount > 0) {
            discountApplied = true;
            discountDetails.push({
              name: item.name,
              quantity: item.quantity,
              originalPrice: item.price * item.quantity,
              discount: discountDescription,
              finalPrice: (item.price * item.quantity) - discountAmount
            });
            total -= discountAmount;
          }
        }
      }

      res.json({
        success: true,
        items: cart.items,
        discountDetails,
        total: Math.max(0, total),
        discountApplied
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  },

  // Clear cart
  clearCart: async (req, res) => {
    try {
      const cart = await getSingleCart();
      
      cart.items = [];
      await cart.save();

      res.json({ 
        success: true,
        message: 'Cart cleared' 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  },

  // Remove item from cart
  removeFromCart: async (req, res) => {
    try {
      const { productId } = req.params;
      const cart = await getSingleCart();
      
      cart.items = cart.items.filter(item => item.productId.toString() !== productId);
      await cart.save();
      
      res.json({ 
        success: true,
        message: 'Item removed from cart',
        cart: cart.items 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  },

  // Update cart item quantity
  updateCartItem: async (req, res) => {
    try {
      const { productId } = req.params;
      const { quantity } = req.body;

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ 
          success: false,
          error: 'Product not found' 
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({ 
          success: false,
          error: 'Insufficient stock' 
        });
      }

      const cart = await getSingleCart();
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
      
      if (itemIndex > -1) {
        if (quantity <= 0) {
          cart.items.splice(itemIndex, 1);
        } else {
          cart.items[itemIndex].quantity = quantity;
        }
      }

      await cart.save();

      res.json({ 
        success: true,
        message: 'Cart updated', 
        cart: cart.items 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }
};

module.exports = cartController;