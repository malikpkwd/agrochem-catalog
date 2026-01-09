import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../CartContext/CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getTotal } = useCart();

  return (
    <div className="container py-4">
      <h1>Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="list-group mb-3">
            {cart.map(item => (
              <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-bold">{item.name}</div>
                  <small className="text-muted">&#8377;{item.price}</small>
                </div>
                <div className="d-flex align-items-center">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                    min="1"
                    className="form-control me-2" 
                    style={{ width: '80px' }}
                  />
                  <button className="btn btn-sm btn-danger" onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>Total: ${getTotal()}</h5>
            <Link to="/checkout" className="btn btn-success">Proceed to Checkout</Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;