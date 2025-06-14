import React, { useEffect, useState } from 'react';
import './NewCollection.css';
import Item from '../Item/Item';

const NewCollection = () => {
  const [products, setProducts] = useState([]);

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:4000/allproducts'); // Update your API endpoint if needed
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Get the last 8 products
  const lastProducts = products.slice(-12);

  return (
    <div className="new-collection">
      <h1>New Collections</h1>
      <hr />
      <div className="collections">
        {lastProducts.length > 0 ? (
          lastProducts.map((item, i) => (
            <Item
              key={i}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </div>
  );
};

export default NewCollection;
