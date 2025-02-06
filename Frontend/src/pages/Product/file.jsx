import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null); // State to hold product data
  const [loading, setLoading] = useState(true); // Loading state for API call

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`http://193.203.162.54:5500/api/${id}`); // Your API endpoint here
        setProduct(response.data); // Set the fetched product data
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error('Error fetching product data:', error);
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  if (loading) {
    return <h2>Loading...</h2>; // Show loading state while data is being fetched
  }

  if (!product) {
    return <h2>Product not found</h2>; // Show error if product is not found
  }

  return (
    <>
      <div className="breadcrumb-section">
        <div className="container">
          <h2>{product.title}</h2>
          <nav className="theme-breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item">Product</li>
              <li className="breadcrumb-item active">{product.title}</li>
            </ol>
          </nav>
        </div>
      </div>

      <section>
        <div className="collection-wrapper">
          <div className="container">
            <div className="row g-4">
              {/* Product Images Section */}
              <div className="col-lg-4">
                <div className="product-slick">
                  {product.image ? (
                    <div>
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-100 img-fluid   lazyload"
                      />
                    </div>
                  ) : (
                    <p>No image available</p>
                  )}
                </div>
              </div>

              {/* Product Details Section */}
              <div className="col-lg-4">
                <div className="product-page-details product-description-box sticky-details mt-0">
                  <h2 className="main-title">{product.title}</h2>

                  <div className="price-text">
                    <h3>
                      <span className="fw-normal">Price:</span> ${product.price.toFixed(2)}
                    </h3>
                    {product.discount && <span>{product.discount}</span>}
                  </div>

                  <div className="product-rating">
                    <div className="rating-list">
                      {[...Array(Math.floor(product.rating))].map((_, i) => (
                        <i key={i} className="ri-star-fill"></i>
                      ))}
                      {product.rating % 1 !== 0 && <i className="ri-star-half-fill"></i>}
                      {[...Array(5 - Math.ceil(product.rating))].map((_, i) => (
                        <i key={i + Math.ceil(product.rating)} className="ri-star-line"></i>
                      ))}
                    </div>
                    <span className="divider">|</span>
                    <a href="#!">0 Reviews</a> {/* Placeholder for reviews count */}
                  </div>
                </div>
              </div>

              {/* Color & Buy Section */}
              <div className="col-lg-4">
                <div className="product-page-details product-form-box product-right-box d-flex align-items-center flex-column my-0">
                  <h4 className="sub-title">Colour:</h4>
                  <div className="variation-box size-box">
                    <ul className="image-box image">
                      {product.colors && product.colors.length > 0 ? (
                        product.colors.map((color, index) => (
                          <li key={index} className={index === 0 ? 'active' : ''}>
                            <a>{color}</a>
                          </li>
                        ))
                      ) : (
                        <p>No color options available</p>
                      )}
                    </ul>
                  </div>

                  <div className="product-buttons">
                    <div className="d-flex align-items-center gap-3">
                      <button className="btn btn-animation btn-solid hover-solid scroll-button" type="button">
                        Add to Cart
                      </button>
                      <a href="#!" className="btn btn-solid buy-button">Buy Now</a>
                    </div>
                  </div>

                  <div className="buy-box justify-content-center gap-3">
                    <a href="#!">
                      <i className="ri-heart-line"></i>
                      <span>Add To Wishlist</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductDetail;
