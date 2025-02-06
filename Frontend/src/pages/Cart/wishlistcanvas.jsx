import React, { useEffect, useState } from "react";
import axios from "axios";

const WishlistCanvas = ({product}) => {
  const [wishlist, setWishlist] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const fetchWishlistDetails = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          `http://193.203.162.54:5500/api/wishlist/${userId}`
        );

        console.log("Wishlist response:", response.data); // Debug log

        const wishlistData = response.data.wishlist.products || [];
        const productsWithDetails = await fetchProductDetails(wishlistData);

        setWishlist(productsWithDetails);
        calculateSubtotal(productsWithDetails);
      } catch (error) {
        console.error("Error fetching wishlist details:", error);
      }
    };

    fetchWishlistDetails();
  }, []);

  // Fetch product details for each productId
  const fetchProductDetails = async (products) => {
    const updatedProducts = [];
    for (const item of products) {
      try {
        const productResponse = await axios.get(
          `http://193.203.162.54:5500/api/product/${item.productId}`
        );
        updatedProducts.push({
          ...item,
          productDetails: productResponse.data,
        });
      } catch (error) {
        console.error("Error fetching product details:", error);
        updatedProducts.push(item); // Push the original item if fetching fails
      }
    }
    return updatedProducts;
  };

  // Calculate subtotal
  const calculateSubtotal = (products) => {
    const total = products.reduce((acc, item) => {
      const price = item.productDetails?.price || 0; // Default to 0 if price is missing
      const quantity = item.quantity || 1; // Default to 1 if quantity is missing
      return acc + price * quantity;
    }, 0);
    setSubtotal(total);
  };

  // Remove an item from the wishlist and database
  const removeFromWishlist = async (productId) => {
    try {
      const userId = localStorage.getItem("userId");
      await axios.delete(`http://193.203.162.54:5500/api/wishlist/${userId}/${productId}`);
      
      const updatedWishlist = wishlist.filter((item) => item.productId !== productId);
      setWishlist(updatedWishlist);
      calculateSubtotal(updatedWishlist);
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
    }
  };

  // Add an item to the cart and remove from the wishlist
  // Add an item to the cart and remove from the wishlist
const addToCart = async (productId) => {
  try {
    const userId = localStorage.getItem("userId");

    // Ensure we are sending the correct product ID and quantity (default to 1)
    const response = await axios.post("http://193.203.162.54:5500/api/cart/add", {
      userId : userId,
      productId : productId,   // Include productId in the request body
      quantity: 1,  // Default quantity to 1
    });

    // Log the response to check if _id is returned
    console.log("Product added to cart:", response.data);
    alert("Product added to cart successfully!");

    // Check if the response contains the cartItem and _id
 

    window.location.href = "/";  // Redirect to the cart page or another page
    setIsAdded(true);
  } catch (err) {
    console.error("Error adding to cart:", err);
    alert("There was an error adding the product to your cart.");
  }
};

  
  // Clear the entire wishlist
  const clearWishlist = () => {
    setWishlist([]);
    setSubtotal(0);
  };

  return (
    <div
      className="offcanvas offcanvas-end wishlist-offcanvas"
      style={{ width: "50vw" }}
      tabIndex="-1"
      id="wishlistOffcanvas"
      aria-labelledby="wishlistOffcanvasLabel"
    >
      <section className="wishlist-section section-b-space">
        <div className="container">
          <div className="table-responsive">
            <table className="table wishlist-table">
              <thead>
                <tr className="table-head">
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {wishlist.length > 0 ? (
                  wishlist.map((item) => (
                    <tr key={item.productId}>
                      <td>
                        <a href={`/product/${item.productId}`}>
                          <img
                            src={`http://193.203.162.54:5500/${item.productDetails?.images[0]}`}
                            className="img-fluid"
                            alt={item.productDetails?.title}
                          />
                        </a>
                      </td>
                      <td>
                        <a href={`/product/${item.productId}`}>
                          {item.productDetails?.title}
                        </a>
                      </td>
                      <td>
                        <h2>₹{item.productDetails?.price || "0.00"}</h2>
                      </td>
                      <td>
                        <button
                          onClick={() => removeFromWishlist(item.productId)}
                          className="btn btn-solid"
                        >
                          Remove from Wishlist
                        </button>
                        <button
                          onClick={() => addToCart(item.productId)}
                          className="btn btn-solid"
                        >
                          Move to Cart
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No items in your wishlist.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="row wishlist-buttons">
            <div className="col-6">
              <a href="/" className="btn btn-solid text-capitalize">
                Continue Shopping
              </a>
            </div>
            <div className="col-6">
              <button
                data-bs-toggle="offcanvas"
                data-bs-target="#cartOffcanvas"
                className="btn btn-solid text-capitalize"
              >
                View Cart
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WishlistCanvas;
