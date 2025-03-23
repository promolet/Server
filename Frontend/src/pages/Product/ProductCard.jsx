import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const ProductCard = ({ product }) => {
  const [isAdded, setIsAdded] = useState(false);
  const [isAddedWishlist, setIsAddedWishlist] = useState(false);
  const navigate = useNavigate(); // Hook for redirection

  // Local offers and price logic
  const offers = ["Flat 30% Off on Orders Above ₹500"];
  const originalPrice = (product.price / 0.7).toFixed(2);

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }

    try {
      await axios.post("https://api.prumolet.com/api/cart/add", {
        userId,
        productId: product._id,
        quantity: 1,
      });
      setIsAdded(true);
      alert("Product added to cart!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("There was an error adding the product to your cart.");
    }
  };

  const handleAddToWishlist = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }

    try {
      await axios.post("https://api.prumolet.com/api/wishlist/add", {
        userId,
        productId: product._id,
        quantity: 1,
      });
      setIsAddedWishlist(true);
      alert("Product added to wishlist!");
    } catch (err) {
      console.error("Error adding to wishlist:", err);
      alert("There was an error adding the product to your wishlist.");
    }
  };

  return (
    <div className="col-xl-4 col-6 col-grid-box">
      <div className="basic-product theme-product-1">
        <div className="overflow-hidden">
          <div className="img-wrapper">
            <Link to={`/shop/${product.title}/${product._id}`}>
              <img
                src={`https://api.prumolet.com/${product.images[0]}`}
                className="w-100 img-fluid lazyload"
                alt={product.title}
              />
            </Link>
            <div className="rating-label">
              <i className="ri-star-fill"></i>
              <span>{product.rating}</span>
            </div>
            <div className="cart-info">
              <a
                href="#!"
                title="Add to Wishlist"
                className="wishlist-icon"
                onClick={handleAddToWishlist}
              >
                <i className="ri-heart-line"></i>
              </a>
              <button title="Add to Cart" onClick={handleAddToCart}>
                <i className="ri-shopping-cart-line"></i>
              </button>
            </div>
          </div>
          <div className="product-detail">
            <div>
              <Link className="product-title" to={`/product/${product._id}`}>
                {product.title}
              </Link>
              <h6>{product.description}</h6>
              <h4 className="price">
                ₹{product.price.toFixed(2)}
                <del> ₹{originalPrice}</del>
                <span className="discounted-price">30% Off</span>
              </h4>
            </div>
            <ul className="offer-panel">
              {offers.map((offer, index) => (
                <li key={index}>
                  <span className="offer-icon">
                    <i className="ri-discount-percent-fill"></i>
                  </span>
                  {offer}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
