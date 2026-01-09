import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../CartContext/CartContext';
import products from '../data/products';

const ProductList = () => {
  const [productList, setProductList] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    // Simulate API fetch
    setProductList(products);
  }, []);

  return (
    <div className="container py-4">
      <div className="row g-4">
        {productList.map(product => (
          <div key={product.id} className="col-sm-6 col-md-4">
            <div className="card h-100">
              <img src={product.image} className="card-img-top" alt={product.name} />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text mb-2">&#8377;{product.price}</p>
                <div className="mt-auto d-flex justify-content-between align-items-center">
                  <Link to={`/product/${product.id}`} className="btn btn-sm btn-outline-primary">View</Link>
                  <button className="btn btn-sm btn-primary" onClick={() => addToCart(product)}>Add to Cart</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;