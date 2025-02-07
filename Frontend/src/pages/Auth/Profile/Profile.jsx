import axios from "axios";
import React, { useEffect, useState } from "react";
import AddAddress from "../../Billing/AddAddress";
import EditAddressModal from "./EditAdress";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [orderDetail, setrderDetail] = useState(0);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  function getBadgeClass(status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-warning'; // Yellow for pending
      case 'delivered':
        return 'bg-success'; // Green for delivered
      case 'cancelled':
        return 'bg-danger'; // Red for cancelled
      case 'in-progress':
        return 'bg-primary'; // Blue for in-progress
      default:
        return 'bg-secondary'; // Gray for unknown status
    }
  }
  
  const handleEditClick = (addressId) => {
    setSelectedAddressId(addressId); // Set the selected address ID
  };
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          `https://api.prumolet.com/api/user/${userId}`
        );
        setUser(response.data);
      } catch (err) {
        setError(
          err.response ? err.response.data.message : "Error fetching user"
        );
      } finally {
        setLoading(false); // End loading state
      }
    };

    fetchUserDetails();
  }, []);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const ordersResponse = await axios.get(
          `https://api.prumolet.com/api/orders/${userId}`
        );
        setOrders(ordersResponse.data.orders);
        setTotalAmount(ordersResponse.data.totalAmount);
        setTotalOrders(ordersResponse.data.totalOrders);
      } catch (err) {
        setError(
          err.response ? err.response.data.message : "Error fetching data"
        );
      }
    };
    fetchUserData();
  }, []);
  const [addressData, setAddressData] = useState(null);

  // Fetch address data from the backend
  useEffect(() => {
    const fetchAddressData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await fetch(
          `https://api.prumolet.com/api/addresses/${userId}`
        );
        const data = await response.json();

        if (response.ok) {
          setAddressData(data);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching address data:", error);
      }
    };

    fetchAddressData();
  }, []);
  const handleDelete = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return;
    }

    setLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.delete(
        `https://api.prumolet.com/api/addresses/${userId}/${addressId}`
      );
      console.log(response.data.message);

      // Update state after deletion
      setAddressData((prevAddresses) =>
        prevAddresses.filter((address) => address._id !== addressId)
      );
    } catch (error) {
      console.error("Error deleting address:", error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <p>Loading...</p>; // Show a loading message while fetching
  }

  if (!user) {
    return <p>No user data found</p>; // Handle the case where user is null
  }

  return (
    <div>
      <div class="breadcrumb-section">
        <div class="container">
          <h2>Profile</h2>
          <nav class="theme-breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <a href="/">Home</a>
              </li>
              <li class="breadcrumb-item active">Dashboard</li>
            </ol>
          </nav>
        </div>
      </div>
      <section class="dashboard-section section-b-space user-dashboard-section">
        <div class="container">
          <div class="row">
            <div class="col-lg-3">
              <div class="dashboard-sidebar">
                <button class="btn back-btn">
                  <i class="ri-close-line"></i>
                  <span>Close</span>
                </button>
                <div class="profile-top">
                  <div class="profile-top-box">
                    <div class="profile-image">
                      <div class="position-relative">
                        <div class="user-round">
                          <h4>{user.fname[0]}</h4>
                        </div>
                        <div class="user-icon">
                          <input type="file" accept="image/*" />
                          <i class="ri-image-edit-line d-lg-block d-none"></i>
                          <i class="ri-pencil-fill edit-icon d-lg-none"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="profile-detail">
                    <h5>{user.fname}</h5>
                    <h6>{user.email}</h6>
                  </div>
                </div>
                <div class="faq-tab">
                  <ul id="pills-tab" role="tablist" class="nav nav-tabs">
                    <li role="presentation" class="nav-item">
                      <button
                        class="nav-link active"
                        id="info-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#info-tab-pane"
                        type="button"
                        role="tab"
                      >
                        <i class="ri-home-line"></i> dashboard
                      </button>
                    </li>
                    

                    <li role="presentation" class="nav-item">
                      <button
                        class="nav-link"
                        id="order-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#order-tab-pane"
                        type="button"
                        role="tab"
                      >
                        <i class="ri-file-text-line"></i>My Orders
                      </button>
                    </li>

                    <li role="presentation" class="nav-item">
                      <button
                        class="nav-link"
                        id="address"
                        data-bs-toggle="tab"
                        data-bs-target="#address-tab-pane"
                        type="button"
                        role="tab"
                      >
                        <i class="ri-map-pin-line"></i> Saved Address
                      </button>
                    </li>
                    <li role="presentation" class="nav-item logout-cls">
                      <a
                        href="#logout"
                        data-bs-toggle="modal"
                        class="btn loagout-btn"
                      >
                        <i class="ri-logout-box-r-line"></i> Logout
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-lg-9">
              <div class="faq-content tab-content" id="myTabContent">
                <div
                  class="tab-pane fade show active"
                  id="info-tab-pane"
                  role="tabpanel"
                >
                  <div class="counter-section">
                    <div class="welcome-msg">
                      <h4>Hello, {user.fname}</h4>
                      <p>
                        From your My Account Dashboard you have the ability to
                        view a snapshot of your recent account activity and
                        update your account information. Select a link below to
                        view or edit information.
                      </p>
                    </div>
                    <div class="row">
                      <div class="col-md-4">
                        <div class="counter-box">
                          <img
                            src="../assets/images/dashboard/balance.png"
                            alt=""
                            class="img-fluid"
                          />
                          <div>
                            <h3>₹{totalAmount}</h3>
                            <h5>Total Order Amout</h5>
                          </div>
                        </div>
                      </div>

                      <div class="col-md-4">
                        <div class="counter-box">
                          <img
                            src="../assets/images/dashboard/order.png"
                            alt=""
                            class="img-fluid"
                          />
                          <div>
                            <h3>{totalOrders}</h3>
                            <h5>Total Orders</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="box-account box-info">
                      <div class="box-head">
                        <h4>Account Information</h4>
                      </div>
                      <div class="row">
                        <div class="col-sm-12">
                          <div class="box">
                            <ul class="box-content">
                              <li class="w-100">
                                <h6>
                                  Full Name: {user.fname} {user.lname}
                                </h6>
                              </li>
                              <li class="w-100">
                                <h6>email: {user.email}</h6>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div class="box mt-3">
                        <div class="box-head">
                          <h4>Login Details</h4>
                        </div>
                        <div class="row">
                          <div class="col-sm-6">
                            <h6>Email : {user.email}</h6>
                          </div>
                          <div class="col-sm-6">
                            <h6>Password : *******</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                

                <div class="tab-pane fade" id="order-tab-pane" role="tabpanel">
                  <div className="row">
                    <div className="card mb-0 dashboard-table mt-0">
                      <div className="card-body">
                        <div className="top-sec">
                          <h3>My Orders</h3>
                        </div>
                        <div className="total-box mt-0">
                          <div className="wallet-table mt-0">
                            <div className="table-responsive">
                              <table className="table cart-table order-table">
                                <thead>
                                  <tr className="table-head">
                                    <th>Order Number</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>order Status</th>
                                    <th>Payment Method</th>
                                    
                                  </tr>
                                </thead>
                                <tbody>
                                  {orders.map((order) =>
                                    order.orders.map((orderDetails) => (
                                      <tr key={orderDetails._id}>
                                        <td>
                                          <span className="fw-bolder">
                                            #{orderDetails._id}
                                          </span>
                                        </td>
                                        <td>
                                          {new Date(
                                            orderDetails.createdAt
                                          ).toLocaleString()}
                                        </td>
                                        <td>₹{orderDetails.totalAmount}</td>
                                        <td>
  <div
    className={`badge ${getBadgeClass(orderDetails.status)} custom-badge rounded-0`}
  >
    <span>{orderDetails.status}</span>
  </div>
</td>

                                        <td>{orderDetails.paymentOption}</td>
                                     
                                      </tr>
                                    ))
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div className="product-pagination">
                            <div className="theme-paggination-block">
                              <nav>
                                <ul className="pagination">
                                  {/* Pagination logic goes here */}
                                </ul>
                              </nav>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
             
                <div
                  className="tab-pane fade"
                  id="address-tab-pane"
                  role="tabpanel"
                >
                  <div className="row">
                    <div className="col-12">
                      <div className="card mb-0 mt-0">
                        <div className="card-body">
                          <div className="top-sec">
                            <h3>Address Book</h3>
                            <button
                              className="btn btn-sm btn-solid"
                              data-bs-toggle="modal"
                              data-bs-target="#addAddress"
                            >
                              + Add New
                            </button>
                            <AddAddress />
                          </div>
                          <div className="address-book-section">
      <div className="row g-4">
        {addressData &&
        Array.isArray(addressData.details) &&
        addressData.details.length > 0 ? (
          addressData.details.map((address) => (
            <div
              className="select-box active col-xl-4 col-md-6"
              key={address._id}
            >
              <div className="address-box">
                <div className="top">
                  <h6>
                    {address.title} <span>{address.address}</span>
                  </h6>
                </div>
                <div className="middle">
                  <div className="address">
                    <p>{address.address}</p>
                    <p>
                      {address.city}, {address.state}
                    </p>
                    <p>{address.pinCode}</p>
                  </div>
                  <div className="number">
                    <p>
                      Phone: <span>{address.phoneNumber}</span>
                    </p>
                  </div>
                </div>
                <div className="bottom">
                  <a
                    href="#edit-address"
                    data-bs-toggle="modal"
                    className="bottom_btn"
                    onClick={() => handleEditClick(address._id)} // Pass the selected address ID
                  >
                    Edit
                  </a>
                  <button
                    className="bottom_btn"
                    onClick={() => handleDelete(address._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No addresses available.</p>
        )}
      </div>

      {/* Pass the selected address ID to the modal */}
      <EditAddressModal addressId={selectedAddressId} />
    </div>
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

export default Profile;
