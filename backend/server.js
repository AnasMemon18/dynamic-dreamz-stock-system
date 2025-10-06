const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart')); 
app.use('/api/discount-rules', require('./routes/discountRules'));
app.use('/api/checkout', require('./routes/checkout'));

app.get('/', (req, res) => {
  res.json({ message: 'Dynamic Dreamz Stock System API' });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI || process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}...`);
  });
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});