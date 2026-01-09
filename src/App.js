import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './CartContext/CartContext';
import Header from './components/Header';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetails';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import ProductManagement from './components/ProductManagement';
import './App.css';

// Runtime sanity checks to help identify undefined/incorrect imports
try {
  // eslint-disable-next-line no-console
  console.log({ Router: typeof Router, Routes: typeof Routes, Route: typeof Route, CartProvider: typeof CartProvider, Header: typeof Header, ProductList: typeof ProductList, ProductDetail: typeof ProductDetail, Cart: typeof Cart, Checkout: typeof Checkout });
  const missing = [];
  if (typeof Router === 'undefined') missing.push('Router');
  if (typeof Routes === 'undefined') missing.push('Routes');
  if (typeof Route === 'undefined') missing.push('Route');
  if (typeof CartProvider === 'undefined') missing.push('CartProvider');
  if (typeof Header === 'undefined') missing.push('Header');
  if (typeof ProductList === 'undefined') missing.push('ProductList');
  if (typeof ProductDetail === 'undefined') missing.push('ProductDetail');
  if (typeof Cart === 'undefined') missing.push('Cart');
  if (typeof Checkout === 'undefined') missing.push('Checkout');
  if (typeof ProductManagement === 'undefined') missing.push('ProductManagement');
  if (missing.length) throw new Error('Undefined imports: ' + missing.join(', '));
} catch (e) {
  // eslint-disable-next-line no-console
  console.error('App import validation failed:', e);
}

function App() {
  return (
    <CartProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/manage" element={<ProductManagement />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;