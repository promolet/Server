import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null); // State to hold product data
  const [loading, setLoading] = useState(true); // Loading state for API call
  const navigate = useNavigate();
  const [isAdded, setIsAdded] = useState(false);
  const [isAddedWishlist, setIsAddedWishlist] = useState(false);

  const handleAddToCart = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.post("https://api.prumolet.com/api/cart/add", {
        userId,
        productId: product._id,
        quantity: 1,
      });

      alert("Product added to cart:", response.data);
      window.location.href = "/";
      setIsAdded(true);
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("There was an error adding the product to your cart.");
    }
  };

  const handleAddToWishlist = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.post(
        "https://api.prumolet.com/api/wishlist/add",
        {
          userId,
          productId: product._id,
          quantity: 1,
        }
      );

      alert("Product added to wishlist:", response.data);
      window.location.href = "/";
      setIsAddedWishlist(true);
    } catch (err) {
      console.error("Error adding to wishlist:", err);
      alert("There was an error adding the product to your cart.");
    }
  };
  const handleBuyNow = () => {
    navigate(`/billing/${product._id}`, {
      state: {
        type: 'single',
      },
    });
  };
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`https://api.prumolet.com/api/product/${id}`); // Your API endpoint here
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
        <div class="collection-wrapper">
            <div class="container">
                <div class="collection-wrapper">
                    <div class="row g-4">
                    <div className="col-lg-4">
  <div className="product-slick">
    {product.images && product.images.length > 0 ? (
      <div>
        <img
          src={`https://api.prumolet.com/${product.images[0]}`}
          alt={product.title}
          className="w-100 img-fluid lazyload"
        />
      </div>
    ) : (
      <p>No image available</p>
    )}
  </div>
  <div className="row">
    <div className="col-12">
      <div className="slider-nav">
        {product.images &&
          product.images.map((image, index) => (
            <div key={index}>
              <img
                src={`https://api.prumolet.com/${image}`}
                alt={`Image ${index + 1}`}
                className="img-fluid lazyload"
              />
            </div>
          ))}
      </div>
    </div>
  </div>
</div>

                        <div class="col-lg-4">
                            <div class="product-page-details product-description-box sticky-details mt-0">

                                <div class="trending-text ">
                                    <img src="../assets/images/product-details/trending.gif" class="img-fluid" alt=""/>
                                    <h5>Selling fast! 4 people have this in their carts.
                                    </h5>
                                </div>

                                <h2 class="main-title"> {product.title} </h2>
                                <div class="product-rating">
                                    <div class="rating-list">
                                        <i class="ri-star-fill"></i>
                                        <i class="ri-star-fill"></i>
                                        <i class="ri-star-fill"></i>
                                        <i class="ri-star-fill"></i>
                                        <i class="ri-star-line"></i>
                                    </div>

                                    <span class="divider">|</span>
                                    <a href="#!">20 Reviews</a>
                                </div>
                                
                                <div class="price-text">
                                    <h3><span class="fw-normal">MRP:</span>
                                    ₹ {product.price} 
                                        {/* <div class="product-page-details product-form-box  d-flex
                                align-items-center flex-column my-0">
                          
                               
                                <div class="product-buttons">
                                    <div class="d-flex align-items-center gap-3">
                                        
                                        <button  onClick={handleBuyNow} class="btn btn-solid buy-button">Buy Now
                                        </button>
                                    </div>
                                </div>

                                <div class="buy-box justify-content-center gap-3">
                                    <a href="#!" onClick={handleAddToWishlist}>
                                    
                                        <i class="ri-heart-line"></i>
                                        <span>Add To Wishlist</span>
                                    </a>
                                    <a href="#!"
                                                    onClick={handleAddToCart} // Add to Cart functionality
>
                                        <i class="ri-shopping-cart-line"></i>
                                        <span>Add To cart</span>
                                    </a>
                                   
                                </div>
                            </div> */}
                                    </h3><span>Inclusive all the text </span>
                                    
                                </div>

                                <div class="size-delivery-info flex-wrap">
                                    <a href="#return" data-bs-toggle="modal" class=""><i class="ri-truck-line"></i>
                                        Delivery &amp; Return </a>

                                    <a href="#ask-question" class="" data-bs-toggle="modal"><i
                                            class="ri-questionnaire-line"></i>
                                        Ask a Question </a>

                                </div>


                                <div class="accordion accordion-flush product-accordion" id="accordionFlushExample">
                                    <div class="accordion-item">
                                        <h2 class="accordion-header">
                                            <button class="accordion-button collapsed" type="button"
                                                data-bs-toggle="collapse" data-bs-target="#flush-collapseOne"
                                                aria-expanded="false" aria-controls="flush-collapseOne">
                                                Product Description </button>
                                        </h2>
                                        <div id="flush-collapseOne" class="accordion-collapse collapse"
                                            data-bs-parent="#accordionFlushExample">
                                            <div class="accordion-body">
                                                <p>{product.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="accordion-item">
                                        <h2 class="accordion-header">
                                            <button class="accordion-button" type="button" data-bs-toggle="collapse"
                                                data-bs-target="#flush-collapseTwo" aria-expanded="false"
                                                aria-controls="flush-collapseTwo">
                                                Information </button>
                                        </h2>
                                     <div id="flush-collapseTwo" class="accordion-collapse collapse show" data-bs-parent="#accordionFlushExample">
    <div class="accordion-body">
        <div class="bordered-box border-0 mt-0 pt-0">
            <h4 class="sub-title">Product Info</h4>
            <ul class="shipping-info">
                <li><span>SKU: </span>{product.partCode}</li>
                <li><span>Brand: </span>{product.brand}</li>
                <li><span>Model: </span>{product.model}</li>
                <li><span>Capacity: </span>{product.capacity} {product.capacityUnits}</li>
                <li><span>Unit Type: </span>{product.typeOfUnit}</li>
                <li><span>Phase: </span>{product.phase}</li>
                <li><span>Rated Voltage: </span>{product.ratedVoltage}V</li>
                <li><span>Stock Status: </span>{product.stockStatus || 'In stock'}</li>
                <li><span>Quantity: </span>{product.quantity || '40 Items Left'}</li>
            </ul>
        </div>

        <div class="bordered-box">
            <h4 class="sub-title">Delivery Details</h4>
            <ul class="delivery-details">
                <li><i class="ri-truck-line"></i> Your order is likely to reach you within 7 days.</li>
                <li><i class="ri-arrow-left-right-line"></i> Hassle-free returns within 7 Days.</li>
            </ul>
        </div>
    </div>
</div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <div class="product-page-details product-form-box product-right-box d-flex
                                align-items-center flex-column my-0">
                          
                               
                                <div class="product-buttons">
                                    <div class="d-flex align-items-center gap-3">
                                        
                                        <button  onClick={handleBuyNow} class="btn btn-solid buy-button">Buy Now
                                        </button>
                                    </div>
                                </div>

                                <div class="buy-box justify-content-center gap-3">
                                    <a href="#!" onClick={handleAddToWishlist}>
                                    
                                        <i class="ri-heart-line"></i>
                                        <span>Add To Wishlist</span>
                                    </a>
                                    <a href="#!"
                                                    onClick={handleAddToCart} // Add to Cart functionality
>
                                        <i class="ri-shopping-cart-line"></i>
                                        <span>Add To cart</span>
                                    </a>
                                   
                                </div>
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
