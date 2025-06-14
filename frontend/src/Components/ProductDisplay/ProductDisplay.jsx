import React, { useContext, useState } from 'react';
import './ProductDisplay.css';
import star_icon from '../Assets/star_icon.png';
import star_dull_icon from '../Assets/star_dull_icon.png';
import { ShopContext } from '../../Context/ShopContext';

const ProductDisplay = (props) => {
  const { product } = props;
  const { addToCart } = useContext(ShopContext);

  const [selectedSize, setSelectedSize] = useState(null);

  const handleSizeSelection = (size) => {
    setSelectedSize(size);
  };

  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          {/* Assuming product has an array of images */}
          {product.images && product.images.map((img, index) => (
            <img key={index} src={img} alt={`Product Thumbnail ${index + 1}`} />
          ))}
        </div>
        <div className="productdisplay-img">
          {/* Display the main image */}
          <img className="productdisplay-main-img" src={product.image} alt="Product Main" />
        </div>
      </div>
      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-star">
          {/* Dynamically render rating stars */}
          {Array.from({ length: 5 }).map((_, index) => (
            <img
              key={index}
              src={index < product.rating ? star_icon : star_dull_icon}
              alt={`Star ${index + 1}`}
            />
          ))}
        </div>
        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">${product.old_price}</div>
          <div className="productdisplay-right-price-new">${product.new_price}</div>
        </div>
        <div className="productdisplay-right-description">{product.description}</div>
        {product.sizes && product.sizes.length > 0 && (
          <div className="productdisplay-right-size">
            <h1>Select Size</h1>
            <div className="productdisplay-right-size-options">
              {product.sizes.map((size, index) => (
                <div
                  key={index}
                  className={`productdisplay-size-option ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => handleSizeSelection(size)}
                >
                  {size}
                </div>
              ))}
            </div>
          </div>
        )}
        <button
          onClick={() => {
            if (!selectedSize && product.sizes?.length > 0) {
              alert('Please select a size before adding to the cart.');
              return;
            }
            addToCart(product.id);
          }}
        >
          Add to Cart
        </button>
        <p className="productdisplay-right-category">
          <span>Category: </span>
          {product.category}
        </p>
        {product.tags && (
          <p className="productdisplay-right-category">
            <span>Tags: </span>
            {product.tags.join(', ')}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductDisplay;
