import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../CartContext/CartContext';
import products from '../data/products';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const foundProduct = products.find(p => p.id === parseInt(id));
    setProduct(foundProduct);
  }, [id]);

  if (!product) return <p className="p-4">Loading...</p>;

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-6">
          <img src={product.image} alt={product.name} className="img-fluid" />
        </div>
        <div className="col-md-6">
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <p className="h5">&#8377;{product.price}</p>
          <button className="btn btn-primary mt-3" onClick={() => addToCart(product)}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;