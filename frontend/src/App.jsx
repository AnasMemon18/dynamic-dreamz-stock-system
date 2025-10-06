import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Navbar from './components/common/Navbar'
import ProductList from './components/products/ProductList'
import Cart from './components/cart/Cart'
import AdminPanel from './components/admin/AdminPanel' 
import './App.css'

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/admin" element={<AdminPanel />} /> 
            </Routes>
          </main>
        </div>
      </CartProvider>
    </Router>
  )
}

export default App