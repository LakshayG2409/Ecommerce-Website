import React, { useEffect, useState } from "react";
import './HeroProduct.css';

const HeroProduct = () => {
  const [bestSellingProducts, setBestSellingProducts] = useState([]); // Store best-selling products
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Best Selling Products data from the backend
  useEffect(() => {
    const fetchBestSellingProducts = async () => {
      try {
        const response = await fetch("http://localhost:4000/admin/best-sellers"); // Replace with your actual endpoint
        if (!response.ok) {
          throw new Error("Failed to load best-selling products.");
        }
        const data = await response.json();
        
        setBestSellingProducts(data.bestSellingProducts); // Assuming 'bestSellingProducts' contains the products
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellingProducts();
  }, []);

  return (
    <div className="best-selling-products-page">
      <h1>Best Selling Products</h1>

      {loading ? (
        <p>Loading best-selling products...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : bestSellingProducts.length > 0 ? (
        <div className="best-selling-products">
          {bestSellingProducts.map((product) => (
            <div className="best-selling-product" key={product.id}>
              <img
                src={product.image} // Assuming 'image' contains the path to the product image
                alt={product.name}
                className="best-selling-product-image"
              />
              <div className="best-selling-product-info">
                <h2>{product.name}</h2>
                <p><strong>Price:</strong> ${product.new_price.toFixed(2)}</p>
                
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No best-selling products available.</p>
      )}
    </div>
  );
};

export default HeroProduct;
