import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import AddAddress from "./AddAddress";
import AddressSelectionPage from "./Address";
import { Navigate, useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { AuthContext } from "../Auth/Authcontent/Authcontent";

const Billingpage = () => {
  const { user, logout } = useContext(AuthContext); // Assuming user object is stored in context
  const location = useLocation();
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [pointsBalance, setPointsBalance] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null); // State to hold product data
  const [loading, setLoading] = useState(true); // Loading state for API call
  const [course, setCourse] = useState(null);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState("");

  // Handle payment option change
  const handlePaymentOptionChange = (e) => {
    setSelectedPaymentOption(e.target.value);
  };
  const cartTotal =
    location.state?.type === "single"
      ? (product?.price || 0) * (product?.quantity || 1) // For single product
      : cart?.reduce((total, item) => {
          const price = item.productDetails?.price || 0; // Safely access price
          const quantity = item.quantity || 0; // Default to 0 if quantity is missing
          return total + price * quantity;
        }, 0) || 0; // Default to 0 if cart is empty or undefined

  // Calculate total amount including shipping, tax, points, and wallet balance
  const totalAmount =
    location.state?.type === "single"
      ? cartTotal + shippingCost + taxAmount - pointsBalance - walletBalance // Single product case
      : cartTotal + shippingCost + taxAmount - pointsBalance - walletBalance; // Multiple products case

  const handleAddressChange = (e) => {
    setSelectedAddressId(e.target.value);
  };
  const handlePlaceOrder = async () => {
    const userId = localStorage.getItem("userId");
    const addressResponse = await axios.get(
      `https://api.prumolet.com/api/addresses/${userId}/${selectedAddressId}`
    );
    const selectedAddress = addressResponse.data.address;

    if (!selectedAddress) {
      alert("Selected address not found!");
      return;
    }

    const orderData = {
      userId: localStorage.getItem("userId"),
      addressId: selectedAddressId,
      address: selectedAddress,
      paymentOption: selectedPaymentOption, // Ensure this is either 'standard' or 'express'
      product:
        location.state?.type === "single"
          ? [
              {
                productId: product._id,
                productName: product.title,
                quantity: 1,
              },
            ]
          : cart.map((item) => ({
              productId: item.productId, // Ensure this is set for each cart item
              productName: item.productDetails?.title, // Assuming `productName` is available in the cart item
              quantity: item.quantity,
            })),
      cartTotal: cartTotal,
      shippingCost: shippingCost,
      taxAmount: taxAmount,
      totalAmount: totalAmount,
      pointsBalance: pointsBalance,
      walletBalance: walletBalance,
    };

    try {
      const response = await axios.post(
        "https://api.prumolet.com/api/orders/placeOrder",
        orderData
      );
      if (response.data.success) {
        window.location.href = "/orderConformation";
      } else {
        alert("Failed to place the order!");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while placing the order.");
    }
  };
  const handleRazorpayPayment = async () => {
    const userId = localStorage.getItem("userId");

    try {
      // Fetch the selected address details
      const addressResponse = await axios.get(
        `https://api.prumolet.com/api/addresses/${userId}/${selectedAddressId}`
      );
      const selectedAddress = addressResponse.data.address;

      if (!selectedAddress) {
        alert("Selected address not found!");
        return;
      }

      // Prepare order data for Razorpay
      const orderData = {
        userId,
        addressId: selectedAddressId,
        address: selectedAddress,
        product: product
          ? [
              {
                productId: product._id,
                productName: product.title,
                quantity: 1,
                price: product.price,
              },
            ]
          : cart.map((item) => ({
              productId: item.productId,
              productName: item.productDetails?.title,
              quantity: item.quantity,
              price: item.productDetails?.price,
            })),
        cartTotal: cartTotal,
        shippingCost: shippingCost,
        taxAmount: taxAmount,
        totalAmount: totalAmount,
      };

      const orderResponse = await axios.post(
        "https://api.prumolet.com/api/orders/createRazorpayOrder",
        { amount: orderData.totalAmount, currency: "INR" }
      );

      const { id: razorpayOrderId, currency, amount } = orderResponse.data;

      // Configure Razorpay options
      const options = {
        key: "rzp_test_uG3TI1NzE3ByMl", // Replace with your Razorpay key
        amount: amount,
        currency: currency,
        name: "prumolet",
        description: `Order for ${product ? product.title : "multiple items"}`,
        order_id: razorpayOrderId,
        handler: async function (response) {
          // Payment successful; verify and place the order
          const paymentData = {
            ...orderData,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            paymentOption: "Razorpay",
            paymentStatus: "Success",
          };

          try {
            const paymentResponse = await axios.post(
              "https://api.prumolet.com/api/orders/placeOrder",
              paymentData
            );

            if (paymentResponse.data.success) {
              window.location.href = "/orderConformation";
            } else {
              alert("Failed to place the order!");
            }
          } catch (error) {
            console.error("Error while placing the order:", error);
            alert("An error occurred while placing the order.");
          }
        },
        prefill: {
          name: user.fname,
          email: user.email,
        },
        notes: {
          address: selectedAddress,
          orderDetails: product
            ? `Product: ${product.title}, Quantity: 1`
            : `Total items: ${cart.length}, Total amount: ₹${totalAmount}`,
        },
        theme: {
          color: "#3399cc",
        },
      };

      // Open Razorpay payment popup
      const razorpay = new window.Razorpay(options);
      razorpay.open();

      razorpay.on("payment.failed", function (response) {
        alert(
          `Payment failed: ${response.error.description}. Please try again.`
        );
      });
    } catch (error) {
      console.error("Error in Razorpay payment process:", error);
      alert("An error occurred while processing the Razorpay payment.");
    }
  };
  const handleSelectedPayment = async () => {
    if (!selectedPaymentOption) {
      alert("Please select a payment option.");
      return;
    }

    if (!selectedAddressId) {
      alert("Please select a delivery address.");
      return;
    }

    try {
      if (selectedPaymentOption === "cod") {
        // Call the Cash on Delivery function
        await handlePlaceOrder();
      } else if (selectedPaymentOption === "razorpay") {
        // Call the Razorpay payment function
        await handleRazorpayPayment();
      } else {
        alert("Invalid payment option selected.");
      }
    } catch (error) {
      console.error("Error handling payment:", error);
      alert("An error occurred while processing your payment.");
    }
  };

  useEffect(
    () => {
      const fetchDetails = async () => {
        try {
          if (location.state?.type === "single") {
            const fetchProductData = async () => {
              try {
                const response = await axios.get(
                  `https://api.prumolet.com/api/product/${id}`
                ); // Your API endpoint here
                setProduct(response.data); // Set the fetched product data
                setLoading(false); // Set loading to false when data is fetched
              } catch (error) {
                console.error("Error fetching product data:", error);
                setLoading(false);
              }
            };

            fetchProductData();
          } else {
            // Fetch cart details for multiple products
            const userId = localStorage.getItem("userId");
            const response = await axios.get(
              `https://api.prumolet.com/api/cart/${userId}`
            );

            console.log("Cart response:", response.data); // Log the entire response

            if (
              response.data.cart &&
              Array.isArray(response.data.cart.products)
            ) {
              // Assuming fetchProductDetails is a function to fetch additional product data
              const productsWithDetails = await fetchProductDetails(
                response.data.cart.products
              );
              setCart(productsWithDetails); // Set cart with updated product details
              calculateSubtotal(productsWithDetails); // Use the updated function
            } else {
              console.error("Cart or products not found in the response");
              setCart([]); // Ensure cart is always an array
            }
            setLoading(false);
          }
        } catch (error) {
          console.error("Error fetching details:", error);
          setLoading(false); // Stop loading in case of error
        }
      };

      fetchDetails();
    },
    [location.state],
    [id]
  ); // Dependency on location.state so the effect reruns on change

  // Fetch product details for each productId
  const fetchProductDetails = async (cartItems) => {
    const updatedCartItems = await Promise.all(
      cartItems.map(async (item) => {
        try {
          const productResponse = await axios.get(
            `https://api.prumolet.com/api/product/${item.productId}`
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
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("User ID not found");
          return;
        }
        const response = await axios.get(
          `https://api.prumolet.com/api/addresses/${userId}`
        );

        if (response.data && Array.isArray(response.data.details)) {
          setAddresses(response.data.details); // Set the details array
        } else {
          console.error(
            "Expected an array of addresses, but got:",
            response.data
          );
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchAddresses();
  }, []); // Empty dependency array to run only once when the component mounts

  // Calculate subtotal
  const calculateSubtotal = (cartItems) => {
    const total = cartItems.reduce((acc, item) => {
      const price = item.productDetails?.price || 0; // Default to 0 if price is undefined
      const quantity = item.quantity || 1; // Default to 1 if quantity is undefined
      return acc + price * quantity;
    }, 0);
    setSubtotal(total);
  };
  if (loading) {
    return <h2>Loading...</h2>; // Show loading state while data is being fetched
  }

  return (
    <div>
      <div class="breadcrumb-section">
        <div class="container">
          <h2>checkout</h2>
          <nav class="theme-breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <a href="/">Home</a>
              </li>
              <li class="breadcrumb-item active">checkout</li>
            </ol>
          </nav>
        </div>
      </div>
      <section class="section-b-space checkout-section-2">
        <div class="container">
          <div class="checkout-page">
            <div class="checkout-form">
              <div class="row g-sm-4 g-3">
                <div class="col-lg-7">
                  <div class="left-sidebar-checkout">
                    <div class="checkout-detail-box">
                      <ul>
                        <li>
                          <div class="checkout-box">
                            <div class="checkout-title">
                              <h4>Billing Address</h4>
                              <button
                                data-bs-toggle="modal"
                                data-bs-target="#addAddress"
                                class="d-flex align-items-center btn"
                              >
                                <i class="ri-add-line me-1"></i> Add New
                              </button>
                            </div>
                            <AddAddress />
                            <div class="checkout-detail">
                              <div class="row g-3">
                                <div class="col-xxl-6 col-lg-12 col-md-6"></div>
                                <div class="delivery-address-box">
                                {Array.isArray(addresses) && addresses.length > 0 ? (
  addresses.map((address) => (
    <li key={address._id}>
      <input
        className="form-check-input"
        type="radio"
        name="checkbox"
        id={`check-${address._id}`}  // Unique ID for each radio button
        value={address._id}
        checked={selectedAddressId === address._id}
        onChange={handleAddressChange}
      />
      <label className="form-check-label" htmlFor={`check-${address._id}`}>  
        <span className="name">
          {address.title}
        </span>
        <span className="address text-content">
          <span className="text-title">
            Address:
          </span>
          {address.address} {/* Ensure address is a string */}
        </span>
        <span className="address text-content">
          <span className="text-title">
            Pin Code:
          </span>
          {address.pinCode} {/* Ensure pinCode is a string or number */}
        </span>
        <span className="address text-content">
          <span className="text-title">
            Phone:
          </span>
          {address.phoneNumber} {/* Ensure phoneNumber is a string */}
        </span>
      </label>
    </li>
  ))
) : (
  <p>No addresses available.</p>
)}


                                </div>
                              </div>
                            </div>
                          </div>
                        </li>

                        <li>
                          <div className="checkout-box">
                            <div className="checkout-title">
                              <h4>Payment Options</h4>
                            </div>

                            <div className="checkout-detail">
                              <div className="row g-3">
                                <div className="col-sm-6">
                                  <div className="delivery-address-box">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="paymentOption"
                                      id="cod"
                                      value="cod"
                                      checked={selectedPaymentOption === "cod"}
                                      onChange={handlePaymentOptionChange}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="cod"
                                    >
                                      CASH ON DELIVERY
                                    </label>
                                  </div>
                                </div>

                                <div className="col-sm-6">
                                  <div className="delivery-address-box">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="paymentOption"
                                      id="razorpay"
                                      value="razorpay"
                                      checked={
                                        selectedPaymentOption === "razorpay"
                                      }
                                      onChange={handlePaymentOptionChange}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="razorpay"
                                    >
                                      RAZORPAY
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="col-lg-5">
                  <div class="checkout-right-box">
                    <div class="checkout-details">
                      <div class="order-box">
                        <div class="title-box">
                          <h4>Summary Order</h4>
                          <p>
                            For a better experience, verify your goods and
                            choose your shipping option.
                          </p>
                        </div>

                        <ul class="qty">
                          {location.state?.type === "single" ? (
                            // Render single product details
                            <div className="cart-items">
                              <div className="cart-image">
                                <img
                                  src={`https://api.prumolet.com/${product?.images[0]}`}
                                  className="img-fluid"
                                  alt={product?.title}
                                />
                              </div>
                              <div className="cart-content">
                                <h4>{product?.title}</h4>
                                <h5>₹{product?.price.toFixed(2)}</h5>
                                <span className="text-theme">
                                  ₹{(product?.price || 0).toFixed(2)}
                                </span>
                                {/* Add other details like quantity, buy now button, etc. */}
                              </div>
                            </div>
                          ) : (
                            // Render cart items
                            <ul className="cart-items">
                              {cart.map((item) => (
                                <li key={item.productId._id}>
                                  <div className="cart-image">
                                    <img
                                      src={`https://api.prumolet.com/${item.productDetails?.images[0]}`}
                                      className="img-fluid"
                                      alt={item.productDetails?.title}
                                    />
                                  </div>
                                  <div className="cart-content">
                                    <div>
                                      <h4>{item.productDetails?.title}</h4>
                                      <h5>
                                        ₹{item.productDetails?.price.toFixed(2)}{" "}
                                        X {item.quantity}
                                      </h5>
                                    </div>
                                    <span className="text-theme">
                                      ₹
                                      {item.productDetails?.price *
                                      item.quantity
                                        ? (
                                            item.productDetails.price *
                                            item.quantity
                                          ).toFixed(2)
                                        : "0.00"}
                                    </span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </ul>
                      </div>
                    </div>

                    <div class="checkout-details">
                      <div class="order-box">
                        <div class="title-box">
                          <h4>Billing Summary</h4>
                        </div>
                        <div className="custom-box-loader">
                          {location.state?.type === "single" ? (
                            // Single product view
                            <ul className="sub-total">
                              <li>
                                Sub Total{" "}
                                <span className="count">
                                  ₹{product?.price.toFixed(2)}
                                </span>
                              </li>
                             
                            </ul>
                          ) : (
                            // Cart view with shipping, tax, etc.
                            <ul className="sub-total">
                              <li>
                                Sub Total{" "}
                                <span className="count">
                                  ₹{cartTotal.toFixed(2)}
                                </span>
                              </li>
                              <li>
                                Shipping{" "}
                                <span className="count">
                                  ₹{shippingCost.toFixed(2)}
                                </span>
                              </li>
                              <li>
                                Tax{" "}
                                <span className="count">
                                  ₹{taxAmount.toFixed(2)}
                                </span>
                              </li>
                              <li>
                                <h4 className="txt-muted">Points</h4>
                                <h4 className="price txt-muted">
                                  ₹{pointsBalance.toFixed(2)}
                                </h4>
                              </li>
                              <li className="border-cls">
                                <label
                                  for="points"
                                  className="form-check-label m-0"
                                >
                                  Would you prefer to pay using points?
                                </label>
                                <input
                                  type="checkbox"
                                  id="points"
                                  className="checkbox_animated check-it"
                                />
                              </li>
                             
                              <li className="border-cls">
                                <label
                                  for="wallet"
                                  className="form-check-label m-0"
                                >
                                  Would you prefer to pay using wallet?
                                </label>
                                <input
                                  type="checkbox"
                                  id="wallet"
                                  className="checkbox_animated check-it"
                                />
                              </li>
                            </ul>
                          )}

                          {/* Total */}
                          <ul className="total">
                            {location.state?.type === "single" ? (
                              <li>
                                Total{" "}
                                <span className="count">
                                  ₹{product?.price.toFixed(2)}
                                </span>
                              </li>
                            ) : (
                              <li>
                                Total{" "}
                                <span className="count">
                                  ₹{totalAmount.toFixed(2)}
                                </span>
                              </li>
                            )}
                          </ul>
                        </div>

                        <div class="text-end">
                          <button
                            class="btn order-btn"
                            onClick={handleSelectedPayment}
                          >
                            Place Order
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Billingpage;
