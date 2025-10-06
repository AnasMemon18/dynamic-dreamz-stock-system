import React, { useState, useEffect } from 'react';
import { discountAPI, productAPI } from '../../services/api';
import DiscountRuleForm from './DiscountRuleForm';
import './AdminPanel.css';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('discounts');
  const [discountRules, setDiscountRules] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDiscountRules();
    loadProducts();
  }, []);

  const loadDiscountRules = async () => {
    try {
      setLoading(true);
      const response = await discountAPI.getAll();
      setDiscountRules(response.data.data);
    } catch (err) {
      setError('Failed to load discount rules');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await productAPI.getAll();
      setProducts(response.data.data);
    } catch (err) {
      setError('Failed to load products');
    }
  };

  const handleRuleCreated = () => {
    loadDiscountRules();
  };

  const handleDeleteRule = async (ruleId) => {

  };

  if (loading) {
    return <div className="loading">Loading admin panel...</div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <p>Manage discount rules and products</p>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'discounts' ? 'active' : ''}`}
          onClick={() => setActiveTab('discounts')}
        >
          Discount Rules
        </button>
        <button 
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        <button 
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'discounts' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>Discount Rules Management</h2>
              <p>Create and manage discount rules for your products</p>
            </div>

            <div className="admin-grid">
              <div className="form-section">
                <h3>Create New Discount Rule</h3>
                <DiscountRuleForm 
                  products={products} 
                  onRuleCreated={handleRuleCreated} 
                />
              </div>

              <div className="list-section">
                <h3>Existing Discount Rules</h3>
                {discountRules.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">🎯</div>
                    <p>No discount rules created yet</p>
                    <p>Create your first discount rule to get started!</p>
                  </div>
                ) : (
                  <div className="rules-list">
                    {discountRules.map(rule => (
                      <div key={rule._id} className="rule-card">
                        <div className="rule-header">
                          <h4>{rule.name}</h4>
                          <span className={`rule-status ${rule.isActive ? 'active' : 'inactive'}`}>
                            {rule.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        
                        <div className="rule-details">
                          <div className="rule-type">
                            <strong>Type:</strong> 
                            <span className="type-badge">{rule.type}</span>
                          </div>
                          
                          {rule.targetProduct && (
                            <div className="rule-target">
                              <strong>Product:</strong> {rule.targetProduct.name}
                            </div>
                          )}
                          
                          {rule.targetCategory && (
                            <div className="rule-target">
                              <strong>Category:</strong> {rule.targetCategory}
                            </div>
                          )}
                          
                          {rule.percentage && (
                            <div className="rule-value">
                              <strong>Discount:</strong> {rule.percentage}%
                            </div>
                          )}
                          
                          {rule.minimumQuantity && (
                            <div className="rule-value">
                              <strong>Min Quantity:</strong> {rule.minimumQuantity}
                            </div>
                          )}
                        </div>

                        <div className="rule-actions">
                          <button 
                            className="edit-btn"
                            onClick={() => alert('Edit functionality coming soon!')}
                          >
                            Edit
                          </button>
                          <button 
                            className="delete-btn"
                            onClick={() => alert('Delete functionality coming soon!')}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>Products Management</h2>
              <p>View and manage your product catalog</p>
            </div>
            
            <div className="products-grid">
              {products.map(product => (
                <div key={product._id} className="product-admin-card">
                  <div className="product-admin-image">
                    <span className="product-emoji">
                      {product.category === 'Clothing' ? '👕' : 
                       product.category === 'Footwear' ? '👟' : 
                       product.category === 'Jackets' ? '🧥' : '📦'}
                    </span>
                  </div>
                  
                  <div className="product-admin-info">
                    <h3>{product.name}</h3>
                    <p className="product-category">{product.category}</p>
                    <p className="product-price">${product.price}</p>
                    <p className={`product-stock ${product.stock < 10 ? 'low-stock' : ''}`}>
                      Stock: {product.stock}
                    </p>
                  </div>
                  
                  <div className="product-admin-actions">
                    <button className="edit-btn">Edit</button>
                    <button className="stock-btn">Update Stock</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>Analytics Dashboard</h2>
              <p>View store performance and discount usage</p>
            </div>
            
            <div className="analytics-grid">
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <h3>Total Products</h3>
                  <p className="stat-number">{products.length}</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-info">
                  <h3>Active Discounts</h3>
                  <p className="stat-number">
                    {discountRules.filter(rule => rule.isActive).length}
                  </p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">🛒</div>
                <div className="stat-info">
                  <h3>Total Categories</h3>
                  <p className="stat-number">
                    {[...new Set(products.map(p => p.category))].length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="coming-soon">
              <h3>Advanced Analytics Coming Soon</h3>
              <p>Sales reports, discount performance, and customer insights will be available in the next update.</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;