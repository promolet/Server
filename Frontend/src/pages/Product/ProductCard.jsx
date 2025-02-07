import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import img from "./1.jpg";

const ProductCard = ({ product }) => {
  const [isAdded, setIsAdded] = useState(false);
  const [isAddedWishlist, setIsAddedWishlist] = useState(false);

  // Local offers and price logic
  const offers = [
    "10% Cashback on UPI Payments",
    "Flat ₹100 Off on Orders Above ₹500",
  ];
  const originalPrice = (product.price * 1.2).toFixed(2); // Assuming a 20% discount on the original price

  const handleAddToCart = async () => {
    try {
      const userId = localStorage.getItem("userId");
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
    try {
      const userId = localStorage.getItem("userId");
      await axios.post("https://api.prumolet.com/api/wishlist/add", {
        userId,
        productId: product._id,
        quantity: 1,
      });
      alert("Product added to wishlist!");
      setIsAddedWishlist(true);
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
            <Link to={`/product/${product._id}`}>
              <img
                src={`https://api.prumolet.com/${product.images[0]}`}
                className="w-100 img-fluid   lazyload"
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
              <button
                title="Add to Cart"
                onClick={handleAddToCart}
              >
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
                <span className="discounted-price">
                  {" "}
                  {Math.round(((originalPrice - product.price) / originalPrice) * 100)}% Off{" "}
                </span>
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
