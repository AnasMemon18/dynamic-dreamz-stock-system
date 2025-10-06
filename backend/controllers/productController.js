const Product = require('../models/Product');

const productController = {
  // Get all products
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find();
      res.json({
        success: true,
        data: products
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  },

  // Get product by ID
  getProductById: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ 
          success: false,
          error: 'Product not found' 
        });
      }
      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  },

  // Update stock after checkout
  updateStock: async (req, res) => {
    try {
      const { quantity } = req.body;
      const product = await Product.findById(req.params.id);
      
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

      product.stock -= quantity;
      await product.save();

      res.json({ 
        success: true,
        message: 'Stock updated successfully', 
        data: product 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  },

  
  createProduct: async (req, res) => {
    try {
      const product = new Product(req.body);
      await product.save();
      res.status(201).json({
        success: true,
        data: product
      });
    } catch (error) {
      res.status(400).json({ 
        success: false,
        error: error.message 
      });
    }
  }
};

module.exports = productController;