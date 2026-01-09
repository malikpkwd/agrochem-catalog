import React, { useState } from 'react';
import { useCart } from '../CartContext/CartContext';

const Checkout = () => {
  const { cart, getTotal } = useCart();
  const [form, setForm] = useState({ 
    fullName: '', 
    email: '', 
    mobile: '', 
    address: '', 
    city: '', 
    state: '', 
    country: '', 
    pincode: '', 
    payment: '' 
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    if (!form.fullName || !form.email || !form.mobile || !form.address || 
        !form.city || !form.state || !form.country || !form.pincode || !form.payment) {
      alert('Please fill in all fields');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      
      // Save address to backend
      const response = await fetch('http://localhost:3001/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          cartItems: cart,
          total: getTotal(),
          orderDate: new Date().toISOString()
        })
      });

      if (!response.ok) throw new Error('Failed to save address');
      
      const savedOrder = await response.json();

      // Send confirmation email
      const emailResponse = await fetch('http://localhost:3001/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...savedOrder,
          fullName: form.fullName,
          email: form.email,
          address: form.address,
          city: form.city,
          state: form.state,
          country: form.country,
          pincode: form.pincode
        })
      });

      if (!emailResponse.ok) {
        console.warn('Email sending failed, but order was saved');
      }
      
      setOrderPlaced(true);
      setForm({ 
        fullName: '', 
        email: '', 
        mobile: '', 
        address: '', 
        city: '', 
        state: '', 
        country: '', 
        pincode: '', 
        payment: '' 
      });
      
      setTimeout(() => setOrderPlaced(false), 3000);
    } catch (err) {
      alert('Error placing order: ' + err.message);
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">Checkout</h1>
      <div className="row">
        {/* Checkout Form */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Delivery Information</h5>
            </div>
            <div className="card-body">
              {orderPlaced && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  ✓ Order placed successfully! Thank you for your purchase.
                  <button type="button" className="btn-close" onClick={() => setOrderPlaced(false)}></button>
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="fullName" className="form-label">Full Name *</label>
                  <input 
                    className="form-control" 
                    type="text" 
                    id="fullName"
                    name="fullName"
                    placeholder="John Doe"
                    value={form.fullName}
                    onChange={handleInputChange}
                    required 
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email Address *</label>
                  <input 
                    className="form-control" 
                    type="email" 
                    id="email"
                    name="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={handleInputChange}
                    required 
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="mobile" className="form-label">Mobile Number *</label>
                  <input 
                    className="form-control" 
                    type="tel" 
                    id="mobile"
                    name="mobile"
                    placeholder="+1 (555) 123-4567"
                    value={form.mobile}
                    onChange={handleInputChange}
                    required 
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="address" className="form-label">Street Address *</label>
                  <textarea 
                    className="form-control" 
                    id="address"
                    name="address"
                    placeholder="House no., Street name"
                    value={form.address}
                    onChange={handleInputChange}
                    rows="2"
                    required 
                  ></textarea>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="city" className="form-label">City *</label>
                    <input 
                      className="form-control" 
                      type="text" 
                      id="city"
                      name="city"
                      placeholder="City"
                      value={form.city}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="state" className="form-label">State/Province *</label>
                    <input 
                      className="form-control" 
                      type="text" 
                      id="state"
                      name="state"
                      placeholder="State"
                      value={form.state}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="country" className="form-label">Country *</label>
                    <input 
                      className="form-control" 
                      type="text" 
                      id="country"
                      name="country"
                      placeholder="Country"
                      value={form.country}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="pincode" className="form-label">Postal Code *</label>
                    <input 
                      className="form-control" 
                      type="text" 
                      id="pincode"
                      name="pincode"
                      placeholder="12345"
                      value={form.pincode}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="payment" className="form-label">Payment Method *</label>
                  <select 
                    className="form-control" 
                    id="payment"
                    name="payment"
                    value={form.payment}
                    onChange={handleInputChange}
                    required 
                  >
                    <option value="">Select payment method</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="debit_card">Debit Card</option>
                    <option value="net_banking">Net Banking</option>
                    <option value="upi">UPI</option>
                    <option value="cash_on_delivery">Cash on Delivery</option>
                  </select>
                </div>

                <button className="btn btn-primary w-100 btn-lg mt-3" type="submit" disabled={loading}>
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-md-6">
          <div className="card sticky-top" style={{ top: '20px' }}>
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              {cart.length === 0 ? (
                <p className="text-muted text-center py-3">Your cart is empty</p>
              ) : (
                <>
                  <ul className="list-group mb-3">
                    {cart.map(item => (
                      <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-bold">{item.name}</div>
                          <small className="text-muted">Qty: {item.quantity}</small>
                        </div>
                        <div className="fw-bold text-success">&#8377;{(item.price * item.quantity).toFixed(2)}</div>
                      </li>
                    ))}
                  </ul>

                  <hr />

                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span>&#8377;{getTotal().toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Shipping:</span>
                    <span className="text-success">Free</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span>Tax (10%):</span>
                    <span>&#8377;{(getTotal() * 0.1).toFixed(2)}</span>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between">
                    <h5 className="mb-0">Total:</h5>
                    <h5 className="mb-0 text-success">&#8377;{(getTotal() * 1.1).toFixed(2)}</h5>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;