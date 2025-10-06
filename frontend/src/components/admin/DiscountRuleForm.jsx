import React, { useState } from 'react';
import { discountAPI } from '../../services/api';
import './DiscountRuleForm.css';

const DiscountRuleForm = ({ products, onRuleCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'BOGO',
    targetProduct: '',
    targetCategory: '',
    percentage: '',
    minimumQuantity: '1',
    isActive: true
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    
  };

  // Get unique categories from products
  const categories = [...new Set(products.map(p => p.category))];

  return (
    <form className="discount-rule-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Rule Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Summer Sale - 50% Off"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="type">Discount Type *</label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option value="BOGO">Buy 1 Get 1 Free</option>
          <option value="TWO_FOR_ONE">Buy 2 for 1 Price</option>
          <option value="PERCENTAGE">Percentage Discount</option>
        </select>
      </div>

      {formData.type !== 'PERCENTAGE' && (
        <div className="form-group">
          <label htmlFor="targetProduct">Target Product *</label>
          <select
            id="targetProduct"
            name="targetProduct"
            value={formData.targetProduct}
            onChange={handleChange}
            required={formData.type !== 'PERCENTAGE'}
          >
            <option value="">Select a product</option>
            {products.map(product => (
              <option key={product._id} value={product._id}>
                {product.name} (${product.price})
              </option>
            ))}
          </select>
        </div>
      )}

      {formData.type === 'PERCENTAGE' && (
        <>
          <div className="form-group">
            <label htmlFor="targetCategory">Target Category (Optional)</label>
            <select
              id="targetCategory"
              name="targetCategory"
              value={formData.targetCategory}
              onChange={handleChange}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <small>Leave empty to apply to all products</small>
          </div>

          <div className="form-group">
            <label htmlFor="percentage">Discount Percentage *</label>
            <input
              type="number"
              id="percentage"
              name="percentage"
              value={formData.percentage}
              onChange={handleChange}
              min="1"
              max="100"
              placeholder="e.g., 50 for 50% off"
              required={formData.type === 'PERCENTAGE'}
            />
          </div>
        </>
      )}

      <div className="form-group">
        <label htmlFor="minimumQuantity">Minimum Quantity *</label>
        <input
          type="number"
          id="minimumQuantity"
          name="minimumQuantity"
          value={formData.minimumQuantity}
          onChange={handleChange}
          min="1"
          required
        />
        <small>Minimum items required for discount to apply</small>
      </div>

      <div className="form-group checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
          <span className="checkmark"></span>
          Active Rule
        </label>
        <small>Uncheck to disable this rule temporarily</small>
      </div>

      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      <button 
        type="submit" 
        className="submit-btn"
        disabled={true}
      >
        {loading ? 'Creating...' : 'Create Discount Rule Functionality Coming soon...'}
      </button>

      <div className="form-info">
        <h4>💡 Discount Type Examples:</h4>
        <ul>
          <li><strong>BOGO</strong>: Buy 1 Get 1 Free (every second item free)</li>
          <li><strong>2-for-1</strong>: Buy 2 items, pay for only 1</li>
          <li><strong>Percentage</strong>: Fixed percentage off the total</li>
        </ul>
      </div>
    </form>
  );
};

export default DiscountRuleForm;