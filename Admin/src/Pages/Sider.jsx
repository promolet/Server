import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../Pages/PrumoLET_logo.png'
const Sider = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [orders, setOrders] = useState([]); // State for storing orders
  const navigate = useNavigate();

  // Check if admin is logged in
  useEffect(() => {
    const adminToken = localStorage.getItem('authToken');
    if (adminToken) {
      setIsAdminLoggedIn(true);
      // Optionally, fetch user details if needed
      const user = JSON.parse(localStorage.getItem('user'));
      setUserDetails(user); // Assuming user details are stored in localStorage
      fetchOrders(); // Fetch orders when the admin is logged in
    }
  }, []);

  const fetchOrders = async () => {
    try {
      // Fetch orders from backend API
      const response = await axios.get('https://api.prumolet.com/api/orders'); // Your API endpoint for orders
      setOrders(response.data); // Set the orders to state
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleLogout = () => {
    // Clear authentication data (e.g., token and user details from localStorage)
    localStorage.removeItem('authToken');
    localStorage.removeItem('user'); // Corrected key here
    setIsAdminLoggedIn(false);
    setUserDetails(null);
    setOrders([]); // Clear orders on logout
    navigate('/Auth'); // Redirect to login page
  };
  

  const handleLogin = () => {
    navigate('/login'); // Redirect to login page
  };

  return (
    <div>
      <div className="dashboard-sidebar">
        <div className="profile-top">
          <div className="profile-image vendor-image">
            <img src={logo} alt="" className="img-fluid" />
          </div>
          <div className="profile-detail">
            {isAdminLoggedIn && userDetails ? (
              <>
                <h5>{userDetails.fname}</h5>
                <h6>{userDetails.email}</h6>
              </>
            ) : (
              <h5>prumolet</h5>
            )}
          </div>
        </div>
        <div className="faq-tab">
          <ul className="nav nav-tabs" id="top-tab" role="tablist">
            <li className="nav-item">
              <a data-bs-toggle="tab" className="nav-link active" href="#dashboard">
                <i className="ri-home-line"></i> dashboard
              </a>
            </li>
            <li className="nav-item">
              <a data-bs-toggle="tab" className="nav-link" href="#orders">
                <i className="ri-file-text-line"></i> orders
              </a>
            </li>
            <li className="nav-item">
              <a data-bs-toggle="tab" className="nav-link" href="#products">
                <i className="ri-product-hunt-line"></i> products
              </a>
            </li>
            <li className="nav-item">
              <a data-bs-toggle="tab" className="nav-link" href="#Addcourse">
                <i className="ri-settings-line"></i> course
              </a>
            </li>
            <li className="nav-item">
              <a data-bs-toggle="tab" className="nav-link" href="#Users">
                <i className="ri-file-text-line"></i> Users
              </a>
            </li>
            <li className="nav-item">
              <a data-bs-toggle="tab" className="nav-link" href="#AcerrorCode">
                <i className="ri-file-text-line"></i> Acerror
              </a>
            </li>
            
            
          </ul>
        </div>
        <ul className="nav">
          {isAdminLoggedIn ? (
            <>
              <li className="nav-item">
                <button className="btn logout-btn" onClick={handleLogout}>
                  <i className="ri-logout-box-r-line"></i> Logout
                </button>
              </li>
   
            </>
          ) : (
            <li className="nav-item">
              <button className="btn login-btn" onClick={handleLogin}>
                <i className="ri-login-box-line"></i> Login
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sider;
