import React, { useState } from 'react';
import './Navbar.css';
import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart_icon.png';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [menu, setMenu] = useState("");
  const navigate = useNavigate();

  const handleProtectedRoute = (route) => {
    if (localStorage.getItem("auth-token")) {
      navigate(route);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className='navbar'>
      <div className="nav-logo">
        <img src={logo} alt="Logo" />
        <p>Easy Deals</p>
      </div>

      <ul className='nav-menu'>
        <li>
          <Link to='/' className='nav-link'>Home</Link>
        </li>
        <li
          onMouseEnter={() => setMenu("Clothing")}
          onMouseLeave={() => setMenu("")}
        >
          <span className='nav-link'>Clothing</span>
          <ul className={`nav-submenu ${menu === "Clothing" ? 'show' : ''}`}>
            <li>
              <Link to='/clothing/men'>Men</Link>
            </li>
            <li>
              <Link to='/clothing/women'>Women</Link>
            </li>
            <li>
              <Link to='/clothing/kids'>Kids</Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to='/electronics' className='nav-link'>Electronics</Link>
        </li>
        <li>
          <Link to='/shoes' className='nav-link'>Shoes</Link>
        </li>
      </ul>

      <div className='nav-login-cart'>
        {localStorage.getItem("auth-token") ? (
          <button onClick={() => { localStorage.removeItem('auth-token'); window.location.replace('/') }}>
            Log Out
          </button>
        ) : (
          <Link to='/login'><button>Login</button></Link>
        )}
        <button onClick={() => handleProtectedRoute('/cart')}>
          <img src={cart_icon} alt="Cart" />
        </button>
        <button onClick={() => handleProtectedRoute('/checkout')}>Checkout</button>
      </div>
    </div>
  );
};

export default Navbar;
