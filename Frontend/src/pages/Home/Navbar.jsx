import React, { useContext, useEffect, useState } from 'react';
import CartOffcanvas from '../Cart/CartOffcanvas'; 
import Top from './Top';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../Product/ProductCard';
import logo from '../images/PrumoLET_Logo .png';
import './navbar.css'

const Navbar = () => {
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [products, setProducts] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://193.203.162.54:5000//api/Product');
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCartDetails = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await axios.get(`http://193.203.162.54:5000/api/cart/${userId}`);
        if (response.status === 200 && response.data.cart) {
          setCart(response.data.cart);
        } else {
          console.error('Cart or products not found in the response');
        }
      } catch (error) {
        console.error('Error fetching cart details:', error);
      }
    };

    fetchCartDetails();
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header>
      <Top/>
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <div className="main-menu">
              <div className="menu-left">
                <div className="brand-logo">
                  <a href="/">
                    <img src={logo} className="img-fluid lazyload" alt="Logo" />
                  </a>
                </div>
              </div>
              <div className="menu-right pull-right">
                <div>
                  <nav id="main-nav">
                    <div className="toggle-nav" onClick={toggleMenu}>
                      {menuOpen ? (
                        <i className="ri-close-line"></i>  /* Close icon */
                      ) : (
                        <i className="ri-menu-3-line"></i>  /* Hamburger icon */
                      )}
                    </div>
                    <ul
                      id="main-menu"
                      className={`sm pixelstrap sm-horizontal ${menuOpen ? 'show' : ''}`}
                    >
                      <li>
                        <Link to='/'>Home</Link>
                      </li>
                      <li>
                        <Link to="/Shop">Shop</Link>
                      </li>
                      <li>
                        <Link to="/courses">Courses</Link>
                      </li>
                      <li>
                        <Link to='/services'>Services</Link>
                      </li>
                      <li>
                        <Link to="/acerror">AC ERROR CODE</Link>
                      </li>
                      <li>
                        <Link to='/contact'>Contact Us</Link>
                      </li>
                    </ul>
                  </nav>
                </div>
                <div>
                  <div className="icon-nav">
                    <ul>
                      
                      <li className="onhover-div mobile-cart">
                        <div data-bs-toggle="offcanvas" data-bs-target="#cartOffcanvas">
                          <i className="ri-shopping-cart-line"></i>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal and CartOffcanvas components */}
      <CartOffcanvas />
    </header>
  );
};

export default Navbar;
