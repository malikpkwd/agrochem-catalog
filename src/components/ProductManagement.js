import React, { useState, useEffect } from 'react';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: '',
    description: '',
    image: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
      setError('');
    } catch (err) {
      setError('Error loading products: ' + err.message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || '' : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.description) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const url = editingId ? `http://localhost:3001/api/products/${editingId}` : 'http://localhost:3001/api/products';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          price: formData.price,
          description: formData.description,
          image: formData.image || 'https://media.gettyimages.com/id/805830962/photo/farmer-working-in-wheat-field.jpg?s=612x612&w=0&k=20&c=nnY-TfWYcDEgxibaMjYiCN4zbt9R9PG_nH-laWAIPKc='
        })
      });

      if (!response.ok) throw new Error('Failed to save product');
      
      setSuccess(editingId ? 'Product updated successfully!' : 'Product created successfully!');
      setFormData({ id: '', name: '', price: '', description: '', image: '' });
      setEditingId(null);
      setError('');
      
      // Refresh products list
      await fetchProducts();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error saving product: ' + err.message);
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image
    });
    setEditingId(product.id);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3001/api/products/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete product');
        
        setSuccess('Product deleted successfully!');
        setError('');
        await fetchProducts();
        
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Error deleting product: ' + err.message);
        console.error('Delete error:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setFormData({ id: '', name: '', price: '', description: '', image: '' });
    setEditingId(null);
    setError('');
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Product Management</h1>

      {/* Alerts */}
      {error && <div className="alert alert-danger alert-dismissible fade show" role="alert">
        {error}
        <button type="button" className="btn-close" onClick={() => setError('')}></button>
      </div>}
      {success && <div className="alert alert-success alert-dismissible fade show" role="alert">
        {success}
        <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
      </div>}

      {/* Create/Edit Form */}
      <div className="card mb-5">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">{editingId ? 'Edit Product' : 'Create New Product'}</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="name" className="form-label">Product Name *</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="price" className="form-label">Price (<span>&#8377</span>) *</label>
                <input
                  type="number"
                  className="form-control"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description *</label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                rows="3"
              ></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="image" className="form-label">Image URL</label>
              <input
                type="text"
                className="form-control"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              {editingId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Products Table */}
      <div className="card">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">Products List ({products.length})</h5>
        </div>
        <div className="card-body p-0">
          {loading && products.length === 0 ? (
            <div className="p-3 text-center">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="p-3 text-center text-muted">No products found. Create one above!</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '5%' }}>ID</th>
                    <th style={{ width: '20%' }}>Name</th>
                    <th style={{ width: '10%' }}>Price</th>
                    <th style={{ width: '40%' }}>Description</th>
                    <th style={{ width: '25%' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id}>
                      <td className="fw-bold">{product.id}</td>
                      <td>{product.name}</td>
                      <td className="fw-bold text-success">&#8377;{product.price.toFixed(2)}</td>
                      <td>
                        <small className="text-muted">
                          {product.description.substring(0, 60)}...
                        </small>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => handleEdit(product)}
                          disabled={loading}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(product.id)}
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
