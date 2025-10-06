import React, { useState } from 'react';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart(product._id, parseInt(quantity));
    setQuantity(1); // Reset quantity after adding
  };

  // Generate quantity options (1 to min(10, stock))
  const quantityOptions = [];
  const maxQuantity = Math.min(10, product.stock);
  for (let i = 1; i <= maxQuantity; i++) {
    quantityOptions.push(i);
  }

  return (
    <div className="product-card">
      <div className="product-image">
        <span className="product-emoji">
          {product.name.toLowerCase().includes('jeans') ? '👖' : 
          product.name.toLowerCase().includes('shirt') || product.name.toLowerCase().includes('t-shirt') ? '👕' :
          product.name.toLowerCase().includes('shoe') ? '👟' :
          product.name.toLowerCase().includes('jacket') ? '🧥' :
          product.category === 'Clothing' ? '👚' :
          product.category === 'Footwear' ? '👞' :
          product.category === 'Jackets' ? '🥼' : '📦'}
        </span>
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category}</p>
        <p className="product-price">${product.price}</p>
        <p className="product-stock">
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </p>
        
        <div className="product-actions">
          <div className="quantity-selector">
            <label htmlFor={`quantity-${product._id}`}>Quantity:</label>
            <select 
              id={`quantity-${product._id}`}
              value={quantity} 
              onChange={(e) => setQuantity(e.target.value)}
              disabled={product.stock === 0}
            >
              {quantityOptions.map(qty => (
                <option key={qty} value={qty}>
                  {qty}
                </option>
              ))}
            </select>
          </div>
          
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;