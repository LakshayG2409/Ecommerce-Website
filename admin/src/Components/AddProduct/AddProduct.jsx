import React, { useState, useEffect } from 'react';
import './AddProduct.css';
import upload_area from '../../Assets/upload_area.svg';

const AddProduct = () => {
  const [image, setImage] = useState(null);
  const [productDetails, setProductDetails] = useState({
    name: '',
    category: 'Women', // Default category
    new_price: '',
    old_price: '',
    quantity: '',
    description: '', // Added description field
    sizes: [], // Added sizes field
  });

  // Handle image selection
  const imageHandler = (e) => {
    const file = e.target.files[0];
    if (file && ['image/jpeg', 'image/png'].includes(file.type)) {
      setImage(file);
    } else {
      alert('Invalid file type. Please select a JPEG or PNG image.');
    }
  };

  // Handle input changes
  const changeHandler = (e) => {
    const { name, value } = e.target;
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Generate size input field conditionally
  const getSizeOptions = () => {
    if (['Women', 'Men', 'Kid', 'Shoes'].includes(productDetails.category)) {
      return (
        <div className="addproduct-itemfield">
          <p>Select Sizes (comma-separated)</p>
          <input
            value={productDetails.sizes.join(',')}
            onChange={(e) =>
              setProductDetails({
                ...productDetails,
                sizes: e.target.value.split(','),
              })
            }
            type="text"
            placeholder="e.g., S, M, L, XL"
          />
        </div>
      );
    }
    return null;
  };

  // Add Product Function
  const Add_Product = async () => {
    // Validate inputs
    if (!image || !productDetails.name || !productDetails.new_price || !productDetails.old_price || !productDetails.quantity || !productDetails.description.trim()) {
      alert('Please fill in all fields.');
      return;
    }

    if (isNaN(productDetails.new_price) || isNaN(productDetails.old_price)) {
      alert('Prices must be valid numbers.');
      return;
    }

    if (parseFloat(productDetails.new_price) >= parseFloat(productDetails.old_price)) {
      alert('Offer Price must be lower than the original Price.');
      return;
    }

    if (isNaN(productDetails.quantity) || parseInt(productDetails.quantity) <= 0) {
      alert('Quantity must be a valid positive number.');
      return;
    }

    if (['Women', 'Men', 'Shoes'].includes(productDetails.category) && productDetails.sizes.length === 0) {
      alert('Please specify sizes for the selected category.');
      return;
    }

    // FormData for the image and product details
    let formData = new FormData();
    formData.append('product', image); // The field name must match what Multer expects in the backend
    Object.keys(productDetails).forEach((key) => {
      if (key === 'sizes') {
        formData.append(key, productDetails[key].join(',')); // Convert sizes array to a comma-separated string
      } else {
        formData.append(key, productDetails[key]);
      }
    });

    try {
      // Step 1: Upload the image
      const imageUploadResponse = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!imageUploadResponse.ok) {
        const errorText = await imageUploadResponse.text();
        throw new Error(`Image upload failed: ${errorText}`);
      }

      const imageUploadData = await imageUploadResponse.json();

      if (imageUploadData.success) {
        // Step 2: Add the product with the uploaded image URL
        const updatedProduct = {
          ...productDetails,
          image: imageUploadData.image_url, // Use the image URL from the backend
        };

        const productResponse = await fetch('http://localhost:4000/addproduct', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedProduct),
        });

        const productData = await productResponse.json();

        if (productData.success) {
          alert('Product added successfully!');
          setImage(null);
          setProductDetails({
            name: '',
            category: 'Women',
            new_price: '',
            old_price: '',
            quantity: '',
            description: '',
            sizes: [],
          });
        } else {
          alert(`Product creation failed: ${productData.message || 'Unknown error'}`);
        }
      } else {
        alert(`Image upload failed: ${imageUploadData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error:', error.message || error);
      alert(`Error: ${error.message || 'Something went wrong'}`);
    }
  };

  // Cleanup image URL when component unmounts
  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  return (
    <div className="add-product">
      <div className="addproduct-itemfield">
        <p>Product Title</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name="name"
          placeholder="Type Here"
        />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            value={productDetails.old_price}
            onChange={changeHandler}
            type="text"
            name="old_price"
            placeholder="Type Here"
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input
            value={productDetails.new_price}
            onChange={changeHandler}
            type="text"
            name="new_price"
            placeholder="Type Here"
          />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select
          value={productDetails.category}
          onChange={changeHandler}
          name="category"
          className="add-product-selector"
        >
          <option value="Women">Women</option>
          <option value="Men">Men</option>
          <option value="Kid">Kid</option>
          <option value="Electronics">Electronics</option>
          <option value="Shoes">Shoes</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
        <p>Quantity</p>
        <input
          value={productDetails.quantity}
          onChange={changeHandler}
          type="text"
          name="quantity"
          placeholder="Type Here"
        />
      </div>
      {getSizeOptions()}
      <div className="addproduct-itemfield">
        <p>Product Description</p>
        <textarea
          value={productDetails.description}
          onChange={changeHandler}
          name="description"
          placeholder="Type the product description here"
        ></textarea>
      </div>
      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : upload_area}
            className="addproduct-thumbnail"
            alt="Upload preview"
          />
        </label>
        <input
          onChange={imageHandler}
          type="file"
          name="product"
          id="file-input"
          hidden
        />
        <button onClick={Add_Product} className="addproduct-btn">
          Add
        </button>
      </div>
    </div>
  );
};

export default AddProduct;
