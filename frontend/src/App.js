import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import Login from './Pages/Login';
import CheckoutPage from './Pages/CheckoutPage';
import Footer from './Components/Footer/Footer';
import men_banner from './Components/Assets/banner_mens.png';
import women_banner from './Components/Assets/banner_women.png';
import kid_banner from './Components/Assets/banner_kids.png';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/clothing/men" element={<ShopCategory banner={men_banner} category="Men" />} />
          <Route path="/clothing/women" element={<ShopCategory banner={women_banner} category="Women" />} />
          <Route path="/clothing/kids" element={<ShopCategory banner={kid_banner} category="Kid" />} />
          <Route path="/electronics" element={<ShopCategory category="Electronics" />} />
          <Route path="/shoes" element={<ShopCategory category="Shoes" />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
