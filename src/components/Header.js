import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../CartContext/CartContext';

const Header = () => {
  const { cart } = useCart();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">Product Catalog</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/product/1">Products</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/manage">Manage Products</Link>
            </li>
          </ul>
          <div className="d-flex">
            <Link to="/cart" className="btn btn-outline-primary">
              <i className="bi bi-cart"></i> Cart <span className="badge bg-secondary ms-2">{itemCount}</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;