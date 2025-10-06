import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { cartAPI } from '../services/api';

// context creation
const CartContext = createContext();

// Initial state for our cart
const initialState = {
  items: [],
  discountDetails: [],
  total: 0,
  discountApplied: false,
  loading: false,
  error: null
};

// Reducer function to handle cart state changes
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items || [],
        discountDetails: action.payload.discountDetails || [],
        total: action.payload.total || 0,
        discountApplied: action.payload.discountApplied || false,
        loading: false
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_CART':
      return { ...initialState };
    default:
      return state;
  }
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart
  useEffect(() => {
    loadCart();
  }, []);

  // Function to load cart from backend
  const loadCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await cartAPI.getSummary();
      dispatch({ type: 'SET_CART', payload: response.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  // Function to add item to cart
  const addToCart = async (productId, quantity) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await cartAPI.addItem(productId, quantity);
      await loadCart(); // Reload cart to get updated data
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.error || error.message });
      throw error;
    }
  };

  // Function to clear cart
  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
      dispatch({ type: 'CLEAR_CART' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.error || error.message });
      throw error;
    }
  };

  const updateCartItem = async (productId, quantity) => {
  try {
    dispatch({ type: 'SET_LOADING', payload: true });
    await cartAPI.updateItem(productId, quantity);
    await loadCart();
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: error.response?.data?.error || error.message });
    throw error;
  }
};

const removeFromCart = async (productId) => {
  try {
    dispatch({ type: 'SET_LOADING', payload: true });
    await cartAPI.removeItem(productId);
    await loadCart();
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: error.response?.data?.error || error.message });
    throw error;
  }
};

// Function to process checkout
const checkout = async () => {
  try {
    dispatch({ type: 'SET_LOADING', payload: true });
    const response = await cartAPI.checkout();
    
    // Clear cart on successful checkout
    dispatch({ type: 'CLEAR_CART' });
    
    return response.data; // Return order details
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: error.response?.data?.error || error.message });
    throw error;
  }
};

  // Value that will be available to all components
const value = {
  ...state,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  loadCart,
  checkout
};

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context 
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};