import React from 'react';
import './CheckoutModal.css';

const CheckoutModal = ({ isOpen, onClose, onConfirm, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Confirm Checkout</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="checkout-info">
            <div className="info-icon">🛒</div>
            <h3>Ready to complete your purchase?</h3>
            <p>This will process your order and update product stock quantities.</p>
            <div className="checkout-features">
              <div className="feature">✓ Secure payment processing</div>
              <div className="feature">✓ Instant stock updates</div>
              <div className="feature">✓ Order confirmation</div>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button 
            className="cancel-btn" 
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            className="confirm-btn" 
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Confirm Checkout'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;