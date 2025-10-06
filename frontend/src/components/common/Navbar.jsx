import React from 'react';
import { Link, useLocation } from 'react-router-dom'; 
import { useCart } from '../../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { items, total } = useCart();
  const location = useLocation();  // Get current location

  // Calculate total items in cart
  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

  // function to check if a link is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🛍️ Dynamic Dreamz
        </Link>
        
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            Products
          </Link>
          <Link 
            to="/cart" 
            className={`nav-link cart-link ${isActive('/cart') ? 'active' : ''}`}
          >
            Cart ({cartItemsCount}) - ${total.toFixed(2)}
          </Link>
          <Link 
            to="/admin" 
            className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;