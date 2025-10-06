const mongoose = require('mongoose');
const Product = require('../models/Product');
const DiscountRule = require('../models/DiscountRule');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    // Clear existing data
    await Product.deleteMany({});
    await DiscountRule.deleteMany({});

    // Products creation
    const products = await Product.create([
      { name: 'T-shirt', price: 20, stock: 100, category: 'Clothing' },
      { name: 'Shoes', price: 50, stock: 50, category: 'Footwear' },
      { name: 'Jacket', price: 80, stock: 30, category: 'Jackets' },
      { name: 'Jeans', price: 40, stock: 75, category: 'Clothing' }
    ]);

    // Discount rules creation
    await DiscountRule.create([
      {
        name: 'Buy 1 Get 1 Free - T-shirt',
        type: 'BOGO',
        targetProduct: products[0]._id,
        minimumQuantity: 2
      },
      {
        name: 'Buy 2 for 1 Price - Shoes',
        type: 'TWO_FOR_ONE',
        targetProduct: products[1]._id,
        minimumQuantity: 2
      },
      {
        name: '50% Off Jackets',
        type: 'PERCENTAGE',
        targetCategory: 'Jackets',
        percentage: 50
      }
    ]);

    console.log('Sample data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();