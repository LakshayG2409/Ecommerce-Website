import React, { useState, useEffect } from 'react';
import './ProductSearch.css'

const ProductSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to handle search input changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Function to fetch products based on the search term
  const fetchProducts = async (searchQuery) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:4000/allproducts?name=${searchQuery}`);
      
      // Check if the response status is OK (200)
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data); // Set the products state with the response data
    } catch (err) {
      setError(err.message); // Set error state if something goes wrong
    } finally {
      setLoading(false); // Stop loading once request is done
    }
  };

  // Trigger the product search when the search term changes
  useEffect(() => {
    if (searchTerm) {
      fetchProducts(searchTerm);
    } else {
      setProducts([]); // If no search term, clear results
    }
  }, [searchTerm]);

  return (
    <div className="product-search">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search for products..."
      />
      
      {loading && <p>Loading products...</p>}
      {error && <p>{error}</p>}

      <div className="product-list">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>Category: {product.category}</p>
              <p>Price: ${product.new_price}</p>
            </div>
          ))
        ) : (
          <p>.</p>
        )}
      </div>
    </div>
  );
};

export default ProductSearch;
