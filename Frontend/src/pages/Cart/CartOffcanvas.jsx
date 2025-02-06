import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const CartOffcanvas = () => {
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    const fetchCartDetails = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          `http://193.203.162.54:5500/api/cart/${userId}`
        );
        console.log("Cart response:", response.data);

        if (response.data.cart && response.data.cart.products) {
          const productsWithDetails = await fetchProductDetails(
            response.data.cart.products
          );
          setCart(productsWithDetails);
          calculateSubtotal(productsWithDetails);
        } else {
          console.error("Cart or products not found in the response");
        }
      } catch (error) {
        console.error("Error fetching cart details:", error);
      }
    };

    fetchCartDetails();
  }, []);

  const userId = localStorage.getItem("userId");
  console.log("User ID from localStorage:", userId);

  const fetchProductDetails = async (cartItems) => {
    const updatedCartItems = await Promise.all(
      cartItems.map(async (item) => {
        try {
          const productResponse = await axios.get(
            `http://193.203.162.54:5500/api/product/${item.productId}`
          );
          return { ...item, productDetails: productResponse.data };
        } catch (error) {
          console.error("Error fetching product details:", error);
          return item;
        }
      })
    );
    return updatedCartItems;
  };

  const calculateSubtotal = (cartItems) => {
    const total = cartItems.reduce((acc, item) => {
      const price = item.productDetails?.price || 0;
      const quantity = item.quantity || 1;
      return acc + price * quantity;
    }, 0);
    setSubtotal(total);
  };

  const removeFromCart = async (productId) => {
    try {
      const userId = localStorage.getItem("userId");
      console.log("Deleting product with ID:", productId);

      const response = await axios.delete(
        `http://193.203.162.54:5500/api/cart/${userId}/${productId}`
      );
      if (response.status === 200) {
        const updatedCart = cart.filter(
          (item) => item.productId._id !== productId
        );
        setCart(updatedCart);
        calculateSubtotal(updatedCart);
        alert("Product deleted");
        window.location.href = "/";
      } else {
        console.error("Failed to remove product from cart:", response.data);
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const updateCartQuantity = async (productId, change) => {
    try {
      const userId = localStorage.getItem("userId");
      const updatedCart = cart.map((item) => {
        if (item.productId === productId) {
          return { ...item, quantity: Math.max(item.quantity + change, 1) };
        }
        return item;
      });

      setCart(updatedCart);
      calculateSubtotal(updatedCart);

      const updatedItem = updatedCart.find((item) => item.productId === productId);

      await axios.put(`http://193.203.162.54:5500/api/cart/update/${userId}`, {
        productId,
        quantity: updatedItem.quantity,
      });

      console.log("Cart quantity updated successfully!");
    } catch (error) {
      console.error("Error updating cart quantity:", error);
    }
  };

  return (
    <div
      className="offcanvas offcanvas-end cart-offcanvas"
      tabIndex="-1"
      id="cartOffcanvas"
      aria-labelledby="cartOffcanvasLabel"
    >
      <div className="offcanvas-header">
        <h3 className="offcanvas-title" id="cartOffcanvasLabel">
          My Cart ({cart.length})
        </h3>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        >
          <i className="ri-close-line"></i>
        </button>
      </div>
      <div className="offcanvas-body">
        <div className="pre-text-box">
          <p>
            {subtotal >= 20.96
              ? "You are eligible for free shipping!"
              : `Spend ₹${(20.96 - subtotal).toFixed(2)} more and enjoy free shipping!`}
          </p>
          <div
            className="progress"
            role="progressbar"
            aria-valuenow={(subtotal / 20.96) * 100}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div
              className="progress-bar progress-bar-striped progress-bar-animated"
              style={{ width: `${Math.min((subtotal / 20.96) * 100, 100)}%` }}
            >
              <i className="ri-truck-line"></i>
            </div>
          </div>
        </div>

        <div className="cart-media">
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              <ul className="cart-product">
                {cart.map((item) => (
                  <li key={item.productId}>
                    <div className="media">
                      <Link to={`/product/${item.productId}`}>
                        <img
                          src={`http://193.203.162.54:5500/${item.productDetails?.images[0]}`}
                          className="img-fluid"
                          alt={item.productDetails?.title}
                        />
                      </Link>
                      <div className="media-body">
                        <Link to={`/product/${item.productId}`}>
                          <h4>{item.productDetails?.title}</h4>
                        </Link>
                        <h4 className="quantity">
                          <span>
                            {item.quantity} x ₹
                            {item.productDetails?.price
                              ? item.productDetails.price.toFixed(2)
                              : "0.00"}
                          </span>
                        </h4>

                        <div className="qty-box">
                          <div className="input-group qty-container">
                            <button
                              className="btn qty-btn-minus"
                              onClick={() => updateCartQuantity(item.productId, -1)}
                            >
                              <i className="ri-subtract-line"></i>
                            </button>
                            <input
                              type="number"
                              readOnly
                              name="qty"
                              className="form-control input-qty"
                              value={item.quantity}
                            />
                            <button
                              className="btn qty-btn-plus"
                              onClick={() => updateCartQuantity(item.productId, 1)}
                            >
                              <i className="ri-add-line"></i>
                            </button>
                          </div>
                        </div>

                        <div className="close-circle">
                          <button
                            className="close_button delete-button"
                            onClick={() => removeFromCart(item.productId)}
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <ul className="cart_total">
                <li>
                  <div className="total">
                    <h5>
                      Sub Total : <span>₹{subtotal.toFixed(2)}</span>
                    </h5>
                  </div>
                </li>
                <li>
                  <div className="buttons">
                    <Link to="/cart" className="btn view-cart">
                      View Cart
                    </Link>
                    <Link
                      to="/billing"
                      className="btn checkout"
                      state={{ type: "cart" }}
                    >
                      Check Out
                    </Link>
                  </div>
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartOffcanvas;
