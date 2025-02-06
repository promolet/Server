import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Auth/Authcontent/Authcontent';
import logo from '../images/PrumoLET_Logo .png';
const Footer = () => {
    const { user, logout } = useContext(AuthContext); 
  return (

    <footer className="footer-style-1">
      <section className="section-b-space darken-layout">
        <div className="container">
          <div className="row footer-theme g-md-5 g-2 text-center">
            <div className="col-xl-3 col-lg-5 col-md-6 sub-title">
              <div>
                <div className="footer-logo">
                  <a href="/">
                    <img alt="logo" className="img-fluid" src={logo} />
                  </a>
                </div>
                <p>
                  Discover the latest trends and enjoy seamless shopping with our exclusive collections.
                </p>
              </div>
              <div className="footer-social">
                <ul className="list-inline">
                  <li className="list-inline-item">
                    <a target="_blank" rel="noopener noreferrer" href="https://facebook.com/">
                      <i className="ri-facebook-fill"></i>
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/">
                      <i className="ri-twitter-fill"></i>
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a target="_blank" rel="noopener noreferrer" href="https://instagram.com/">
                      <i className="ri-instagram-fill"></i>
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a target="_blank" rel="noopener noreferrer" href="https://youtube.com/">
                      <i className="ri-youtube-fill"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-xl col-lg-3 col-md-3">
              <div className="sub-title">
                <div className="footer-title">
                  <h4>Useful Links</h4>
                </div>
                <div className="footer-content">
                <ul>
                    <li><a className="text-content" href="/shop">Shop</a></li>
                    <li><a className="text-content" href="/courses">Courses</a></li>
                    <li><a className="text-content" href="/services">Services</a></li>
                    <li><a className="text-content" href="/about">About Us</a></li>
                    <li><a className="text-content" href="/Privacy">Privacy Policy</a></li>
                    <li><a className="text-content" href="/Terms">Terms and Conditions</a></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-xl-2 col-md-3">
              <div className="sub-title">
                <div className="footer-title">
                  <h4>Help Center</h4>
                </div>
                <div className="footer-content">
                  <ul>
                    <li><Link className="text-content" to='/'>My Account</Link></li>
                    <li><Link className="text-content" to='/'>My Orders</Link></li>
                    <li><Link className="text-content" to='/faq'>Faq's</Link></li>
                    <li><Link className="text-content" href="/contact">Contact Us</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6">
              <div className="sub-title">
                <div className="footer-title">
                  <h4>Store Information</h4>
                  <ul className="contact-list">
                    <li><i className="ri-map-pin-line"></i> 2nd Floor, H No 69, D No 5-2-430, beside Power Controls India, Hyderbasthi, Rani Gunj, Secunderabad, Telangana 500003</li>
                    <li><i className="ri-phone-line"></i> Call Us: +91 93918 89751</li>
                    <li><i className="ri-mail-line"></i> Email Us: support@prumolet.com</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="sub-footer dark-subfooter">
        <div className="container">
          <div className="row text-center">
            <div className="col-xl-6 col-md-6 col-sm-12">
              <div className="footer-end">
                <p><i className="ri-copyright-line"></i> 2024 - PrumoLET&trade; | Designed & Developed by Digitalness&reg;</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
