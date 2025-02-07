import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import WishlistCanvas from '../Cart/wishlistcanvas';
import { AuthContext } from '../Auth/Authcontent/Authcontent';  // Assuming you're using Context API for auth state

const Top = () => {
  const { user, logout } = useContext(AuthContext); // Assuming user object is stored in context

  return (
    <div>
      <div className="top-header">
        <div className="mobile-fix-option"></div>
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="header-contact">
                <ul>
                  <li>Welcome to Our store prumoLET</li>
                  <li><i className="ri-phone-fill"></i>Call Us: +91 93918 89751</li>
                </ul>
              </div>
            </div>
            <div className="col-lg-6 text-end">
              <ul className="header-dropdown">
                <li className="mobile-wishlist" data-bs-toggle="offcanvas" data-bs-target="#wishlistOffcanvas">
                  <i className="ri-heart-fill"></i>
                </li>

                {user ? (
                  <li className="onhover-dropdown mobile-account">
                    <i className="ri-user-fill"></i>
                    {user.fname} {/* Display user’s first name */}
                    <ul className="onhover-show-div">
                      <li><Link to={`/profile/${user._id}`}>Dashbord</Link></li>
                      <li><a href="#!" onClick={logout}>Logout</a></li>
                    </ul>
                  </li>
                ) : (
                  <>
                    <li className="onhover-dropdown mobile-account">
                      <i className="ri-user-fill"></i>
                      My Account
                      <ul className="onhover-show-div">
                        <li><Link to='/login'>Login</Link></li>
                        <li><Link to='/register'>Register</Link></li>
                      </ul>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <WishlistCanvas />
    </div>
  );
}

export default Top;
