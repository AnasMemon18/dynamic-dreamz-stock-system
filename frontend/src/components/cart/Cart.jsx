import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { cartAPI } from '../../services/api';
import CheckoutModal from '../checkout/CheckoutModal';
import './Cart.css';

const Cart = () => {
  const { 
    items, 
    discountDetails, 
    total, 
    discountApplied, 
    loading, 
    clearCart, 
    updateCartItem, 
    removeFromCart,
    loadCart,
    checkout
  } = useCart();

  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState(null);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity === 0) {
      await removeFromCart(productId);
    } else {
      await updateCartItem(productId, newQuantity);
    }
  };

  const handleRemoveItem = async (productId) => {
    if (window.confirm('Are you sure you want to remove this item from cart?')) {
      await removeFromCart(productId);
    }
  };

 const handleCheckout = async () => {
  setCheckoutLoading(true);
  try {
    const orderDetails = await checkout();
    
    setCheckoutResult(orderDetails);
    setCheckoutModalOpen(false);
    
    // Show success message
    alert(`Checkout successful! Order processed for ${orderDetails.totalItems} items. Total: $${orderDetails.totalAmount}`);
    
  } catch (error) {
    alert(error.response?.data?.error || 'Checkout failed. Please try again.');
  } finally {
    setCheckoutLoading(false);
  }
};

  if (loading) {
    return <div className="loading">Loading cart...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="cart-container">
        <h1>Your Shopping Cart</h1>
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some products to see them here!</p>
          {checkoutResult && (
            <div className="checkout-success">
              <p>🎉 Thank you for your order!</p>
              <p>Order total: ${checkoutResult.totalAmount}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="cart-container">
        <div className="cart-header">
          <h1>Your Shopping Cart</h1>
          <button onClick={clearCart} className="clear-cart-btn">
            Clear Cart
          </button>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            <h2>Items ({items.reduce((total, item) => total + item.quantity, 0)})</h2>
            {items.map(item => (
              <div key={item.productId} className="cart-item">
                <div className="item-image">
                  <span className="item-emoji">
                    {item.category === 'Clothing' ? '👕' : 
                     item.category === 'Footwear' ? '👟' : 
                     item.category === 'Jackets' ? '🧥' : '📦'}
                  </span>
                </div>
                
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-category">{item.category}</p>
                  <p className="item-price">${item.price} each</p>
                </div>
                
                <div className="item-quantity-controls">
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="quantity-display">{item.quantity}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                
                <div className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                
                <button 
                  className="remove-btn"
                  onClick={() => handleRemoveItem(item.productId)}
                  title="Remove item"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            
            {discountApplied && discountDetails.length > 0 && (
              <div className="discount-section">
                <h3>🎉 Discounts Applied</h3>
                {discountDetails.map((discount, index) => (
                  <div key={index} className="discount-item">
                    <div className="discount-name">{discount.name}</div>
                    <div className="discount-amount">{discount.discount}</div>
                    <div className="discount-final">Final: ${discount.finalPrice}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="total-section">
              <div className="total-line">
                <span>Subtotal:</span>
                <span>${items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
              </div>
              
              {discountApplied && (
                <div className="total-line discount">
                  <span>Total Discounts:</span>
                  <span>-${(items.reduce((sum, item) => sum + (item.price * item.quantity), 0) - total).toFixed(2)}</span>
                </div>
              )}
              
              <div className="total-line grand-total">
                <span>Total Amount:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button 
              className="checkout-btn"
              onClick={() => setCheckoutModalOpen(true)}
            >
              🛒 Proceed to Checkout
            </button>
            
            <div className="savings-message">
              {discountApplied && (
                <p className="savings">
                  💰 You saved ${(items.reduce((sum, item) => sum + (item.price * item.quantity), 0) - total).toFixed(2)} with our discounts!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        onConfirm={handleCheckout}
        loading={checkoutLoading}
      />
    </>
  );
};

export default Cart;