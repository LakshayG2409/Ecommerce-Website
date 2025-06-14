const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const sharp = require("sharp");
const fs = require("fs"); // Add fs module to handle file system operations

const app = express();
const port = 4000; // Set to 4000 as requested

app.use(express.json());
app.use(cors());

// Database connection
mongoose
  .connect("Your mongodb id")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1); // Exit the process in case of connection failure
  });

// Image Storage and Upload
const storage = multer.memoryStorage();
const upload = multer({ storage });
app.use('/images', express.static('upload/images'));

app.post('/upload', upload.single('product'), async (req, res) => {
  if (!req.file) {
    console.error('No file uploaded');
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }
  try {
    const resizedImageBuffer = await sharp(req.file.buffer)
      .resize(400, 400)
      
      .toBuffer();
    const filename = `${Date.now()}${path.extname(req.file.originalname)}`;
    const uploadDir = path.join(__dirname, 'upload/images');

    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    await sharp(resizedImageBuffer).toFile(filePath);

    res.json({ success: true, image_url: `http://localhost:${port}/images/${filename}` });
  } catch (error) {
    console.error('Error during image processing:', error);
    res.status(500).json({ success: false, message: 'Failed to process image.' });
  }
});

// Product Schema and Routes
const Product = mongoose.model("Product", {
  id: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  new_price: { type: Number, required: true },
  old_price: { type: Number },
  quantity: { type: Number, required: true, default: 0 },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
  isBestSeller: { type: Boolean, default: false },
  description: { type: String, default: "" }, // Product-specific description
  sizes: { type: [String] }, // Applicable only for clothing/shoes
});

app.post('/addproduct', async (req, res) => {
  const { name, image, category, new_price, old_price, quantity, sizes, description } = req.body;

  // Validate category-specific fields
  if (category === "Men" || category === "Women" || category === "Kid" || category === "Shoes") {
    if (!sizes || !Array.isArray(sizes) || sizes.length === 0) {
      return res.status(400).json({ success: false, error: 'Sizes are required for clothing or shoes.' });
    }
  } else if (category !== "Electronics") {
    return res.status(400).json({ success: false, error: 'Invalid category.' });
  }

  // Automatically set unique id
  const lastProduct = await Product.findOne().sort({ id: -1 });
  const id = lastProduct ? lastProduct.id + 1 : 1;

  const product = new Product({
    id,
    name,
    image,
    category,
    new_price,
    old_price,
    quantity,
    sizes,
    description,
  });

  await product.save();
  res.json({ success: true, name: product.name });
});

// Update Product Quantity
app.patch('/updateproduct/:id', async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (isNaN(quantity) || quantity < 0) {
    return res.status(400).json({ success: false, error: 'Invalid quantity.' });
  }

  try {
    const product = await Product.findOneAndUpdate(
      { id },
      { $set: { quantity } },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.error('Error updating product quantity:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Remove Product
app.post('/removeproduct', async (req, res) => {
  const { id } = req.body;
  const product = await Product.findOneAndDelete({ id });
  if (!product) return res.status(404).json({ success: false, error: 'Product not found.' });
  res.json({ success: true, message: `Product ${product.name} removed successfully.` });
});

// Search Products by Name
app.get('/allproducts', async (req, res) => {
  const { name } = req.query;

  let filter = {};

  if (name) {
    filter.name = { $regex: name, $options: 'i' };  // Case-insensitive search
  }

  try {
    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products.' });
  }
});

// Fetch Best-Selling Products
app.get('/admin/best-sellers', async (req, res) => {
  try {
    const bestSellingProducts = await Product.find({ isBestSeller: true });

    if (!bestSellingProducts || bestSellingProducts.length === 0) {
      return res.status(404).json({ success: false, message: 'No best-selling products found.' });
    }

    res.json({ success: true, bestSellingProducts });
  } catch (error) {
    console.error('Error fetching best-selling products:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch best-selling products.' });
  }
});

// User Schema and Authentication
const Users = mongoose.model('Users', {
  name: String,
  email: { type: String, unique: true },
  password: String,
  cartData: Object,
  address: String, // Added address field
  date: { type: Date, default: Date.now },
});

app.post('/signup', async (req, res) => {
  const existingUser = await Users.findOne({ email: req.body.email });
  if (existingUser) return res.status(400).json({ success: false, error: "User already exists" });

  const cart = Array(300).fill(0).reduce((acc, _, idx) => ({ ...acc, [idx]: 0 }), {});
  const user = new Users({ ...req.body, cartData: cart });
  await user.save();
  const token = jwt.sign({ user: { id: user.id } }, 'secret_ecom');
  res.json({ success: true, token });
});

app.post('/login', async (req, res) => {
  const user = await Users.findOne({ email: req.body.email });
  if (user && req.body.password === user.password) {
    const token = jwt.sign({ user: { id: user.id } }, 'secret_ecom');
    res.json({ success: true, token });
  } else {
    res.json({ success: false, error: "Invalid email or password" });
  }
});

// Cart Handling
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ errors: "Please authenticate using token" });
  } else {
    try {
      const data = jwt.verify(token, "secret_ecom");
      req.user = data.user;
      next();
    } catch (error) {
      res.status(401).send({ errors: "Please authenticate yourself" });
    }
  }
};

// Update Address
app.post("/updateaddress", fetchUser, async (req, res) => {
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ success: false, message: "Address is required" });
  }

  try {
    const updatedUser = await Users.findOneAndUpdate(
      { _id: req.user.id },
      { address },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "Address updated successfully",
    });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Add to Cart
app.post("/addtocart", fetchUser, async (req, res) => {
  let userData = await Users.findOne({ _id: req.user.id });
  userData.cartData[req.body.itemId] += 1;
  await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });

  res.json({
    success: true,
    message: "Item added successfully",
  });
});

// Remove from Cart
app.post("/removefromcart", fetchUser, async (req, res) => {
  let userData = await Users.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemId] > 0) {
    userData.cartData[req.body.itemId] -= 1;
  }
  await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });

  res.json({
    success: true,
    message: "Item removed successfully",
  });
});

// Get Cart Data
app.post("/getcart", fetchUser, async (req, res) => {
  try {
    let userData = await Users.findOne({ _id: req.user.id });
    if (!userData) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json(userData.cartData);
  } catch (error) {
    console.error("Error fetching cart data:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Feedback Schema and Routes
const Feedback = mongoose.model("Feedback", {
  productId: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  feedback: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

// Submit Feedback
app.post('/submit-feedback', fetchUser, async (req, res) => {
  const { productId, feedback } = req.body;

  if (!productId || !feedback || feedback.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Product ID and feedback are required' });
  }

  try {
    const newFeedback = new Feedback({
      productId,
      userId: req.user.id,
      feedback,
    });

    await newFeedback.save();
    res.json({
      success: true,
      message: 'Feedback submitted successfully!',
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ success: false, message: 'Server error while submitting feedback' });
  }
});

// Order Schema and Routes
const Order = mongoose.model("Order", {
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  orderDate: { type: Date, default: Date.now },
  items: Array,
  totalAmount: Number,
  status: { type: String, default: "Pending" },
});

app.post("/placeorder", fetchUser, async (req, res) => {
  const { items, totalAmount } = req.body;

  const order = new Order({
    userId: req.user.id,
    items,
    totalAmount,
    status: "Pending",
  });

  await order.save();

  res.json({
    success: true,
    message: "Order placed successfully!",
  });
});

// Admin Route to fetch all orders
app.get('/admin/orders', async (req, res) => {
  try {
    const orders = await Order.find({ status: "Pending" })
      .populate('userId', 'name email')
      .populate('items.productId', 'name price')
      .select('userId items totalAmount status orderDate'); // Include orderDate
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
