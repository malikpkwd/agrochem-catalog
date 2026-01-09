import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Use the manual mock in src/__mocks__/react-router-dom.js
jest.mock('react-router-dom');

import { CartProvider } from './CartContext/CartContext';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetails';
import Checkout from './components/Checkout';
import products from './data/products';

// Lightweight local router shims for tests (avoids resolving react-router-dom package)
const MemoryRouter = ({ children }) => React.createElement(React.Fragment, null, children);
const Routes = ({ children }) => React.createElement(React.Fragment, null, children);
const Route = ({ element }) => element;

beforeEach(() => {
  localStorage.clear();
});

test('ProductList renders product cards', () => {
  render(
    <CartProvider>
      <MemoryRouter>
        <ProductList />
      </MemoryRouter>
    </CartProvider>
  );

  // Expect first product name to be rendered
  expect(screen.getByText(products[0].name)).toBeInTheDocument();
});

test('Clicking Add to Cart stores item in localStorage', async () => {
  render(
    <CartProvider>
      <MemoryRouter>
        <ProductList />
      </MemoryRouter>
    </CartProvider>
  );

  const addButtons = screen.getAllByText(/Add to Cart/i);
  expect(addButtons.length).toBeGreaterThan(0);

  await userEvent.click(addButtons[0]);

  await waitFor(() => {
    const stored = JSON.parse(localStorage.getItem('cart') || '[]');
    expect(stored.length).toBe(1);
    expect(stored[0].id).toBe(products[0].id);
    expect(stored[0].quantity).toBe(1);
  });
});

test('ProductDetails shows main image for a product', () => {
  render(
    <CartProvider>
      <MemoryRouter initialEntries={[`/product/${products[0].id}`]}>
        <Routes>
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>
    </CartProvider>
  );

  // The main product image should be present with alt text containing product name
  const img = screen.getByAltText(new RegExp(products[0].name, 'i'));
  expect(img).toBeInTheDocument();
});

test('Checkout form contains all address fields', () => {
  render(
    <CartProvider>
      <Checkout />
    </CartProvider>
  );

  expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Mobile Number/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Street Address/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/State/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Country/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Postal Code/i)).toBeInTheDocument();
});
