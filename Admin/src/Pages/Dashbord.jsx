import React, { useEffect, useState } from "react";
import Sider from "./Sider";
import axios from "axios";
import OrderDetails from "./Order";
import AddProductModal from "./AddProduct";
import { Link, useNavigate } from "react-router-dom";
import EditProductModal from "./EditProduct";
import Settings from "./Setting";
import Users from "./Users";
import Course from "./Course";
import "./nav.css";
import ErrorCodes from "./Acerror";

const Dashbord = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const navigate = useNavigate();
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isSiderOpen, setIsSiderOpen] = useState(false);

  const toggleSider = () => {
    setIsSiderOpen(!isSiderOpen);
  };
  // When the button is clicked, this function is called and sets the product ID
  const handleBuyNow = (productId) => {
    navigate(`/billing/${productId}`, {
      state: {
        type: "single",
      },
    });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const ordersResponse = await axios.get(
          `https://api.prumolet.com/api/orders`
        );
        const orderstotal = await axios.get(
          `https://api.prumolet.com/api/total-orders`
        );
        setOrders(ordersResponse.data.orders);
        setTotalAmount(orderstotal.data.totalAmount);
        setTotalOrders(orderstotal.data.totalOrders);
      } catch (err) {
        setError(
          err.response ? err.response.data.message : "Error fetching data"
        );
      }
    };
    fetchUserData();
  }, []);

  // Fetch all products from the backend
  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://api.prumolet.com/api/items");
      setProducts(response.data); // Set the fetched products in the state
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  fetchProducts();

  const handleDelete = async (productId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (confirmDelete) {
        await axios.delete(`https://api.prumolet.com/api/product/${productId}`);
        alert("Product deleted successfully!");
        fetchProducts(); // Refresh the product list after deletion
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete the product. Please try again.");
    }
  };
  return (
    <div>
      <div>
        {/* Breadcrumb Section */}
        <div className="breadcrumb-section bg-light py-3 border-bottom">
          <div className="container d-flex justify-content-between align-items-center">
            {/* Breadcrumb Title */}
            <h2 className="mb-0">Admin Dashboard</h2>

            {/* Hamburger Button */}
            <button
              className="navbar-toggler d-lg-none"
              type="button"
              onClick={toggleSider}
              aria-expanded={isSiderOpen}
              aria-label="Toggle navigation"
            >
              <i className="bi bi-list"></i>
            </button>

            {/* Breadcrumb Navigation */}
            <nav
              className="theme-breadcrumb d-none d-lg-block"
              aria-label="breadcrumb"
            >
              <ol className="breadcrumb mb-0">
               
                <li className="breadcrumb-item" aria-current="page">
                  Admin Dashboard
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Sider Component */}
        {isSiderOpen && (
          <div className="sider-overlay">
            <Sider />
          </div>
        )}
      </div>

      <section class="dashboard-section section-b-space user-dashboard-section">
        <div class="container">
          <div class="row">
            <div class="col-lg-3">
              <Sider />
            </div>
            <div class="col-lg-9">
              <div class="faq-content tab-content" id="top-tabContent">
                <div class="tab-pane fade show active" id="dashboard">
                  <div class="counter-section">
                    <div class="row">
                      <div class="col-md-4">
                        <div class="counter-box">
                          <img
                            src="../assets/images/icon/dashboard/order.png"
                            alt=""
                            class="img-fluid"
                          />
                          <div>
                            <h3>{products.length}</h3>
                            <h5>total products</h5>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-4">
                        <div class="counter-box">
                          <img
                            src="../assets/images/icon/dashboard/sale.png"
                            alt=""
                            class="img-fluid"
                          />
                          <div>
                            <h3>{totalOrders}</h3>
                            <h5>total sales</h5>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-4">
                        <div class="counter-box">
                          <img
                            src="../assets/images/icon/dashboard/homework.png"
                            alt=""
                            class="img-fluid"
                          />
                          <div>
                            <h3>₹{totalAmount}</h3>
                            <h5>Amout</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-7">
                      <div class="card">
                        <div class="card-body">
                          <div id="chart"></div>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-5">
                      <div class="card">
                        <div class="card-body">
                          <div id="chart-order"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row g-sm-4 g-3">
                    <div class="col-12">
                      <div class="dashboard-table">
                        <div class="wallet-table">
                          <div class="top-sec mb-3">
                            <h3>trending products</h3>
                          </div>
                          <div className="table-responsive">
                            <table className="table cart-table order-table">
                              <thead>
                                <tr>
                                  <th>Image</th>
                                  <th>Product Name</th>
                                  <th>Price</th>
                                </tr>
                              </thead>
                              <tbody>
                                {products.map((product) => (
                                  <tr key={product.id}>
                                    <td className="image-box">
                                      <img
                                        src={`https://api.prumolet.com/${product.images[0]}`}
                                        alt={product.title}
                                        className="  lazyloaded"
                                        style={{
                                          width: "50px",
                                          height: "50px",
                                        }}
                                      />
                                    </td>
                                    <td>{product.title}</td>
                                    <td>₹{product.price}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="dashboard-table">
                        <div class="wallet-table">
                          <OrderDetails />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="tab-pane fade" id="products">
                  <div class="dashboard-table">
                    <div class="wallet-table">
                      <div class="top-sec">
                        <h3>all products</h3>
                        <button
                          data-bs-toggle="modal"
                          data-bs-target="#addProductModal"
                          class="btn btn-sm btn-solid"
                        >
                          + add new
                        </button>
                      </div>
                      <AddProductModal />
                      <div className="table-responsive">
                        <table className="table cart-table order-table">
                          <thead>
                            <tr>
                              <th>Image</th>
                              <th>Product Name</th>
                              <th>Category</th>
                              <th>Price</th>
                              <th>stock</th>
                              <th>Edit/Delete</th>
                              <th>Buy</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Array.isArray(products) && products.length > 0 ? (
                              products.map((product) => (
                                <tr key={product._id}>
                                  <td className="image-box">
                                    <img
                                      src={`https://api.prumolet.com/${product.images[0]}`}
                                      alt={product.name}
                                      className="lazyloaded"
                                    />
                                  </td>
                                  <td>{product.title}</td>
                                  <td>{product.category || "fashion"}</td>
                                  <td className="fw-bold text-theme">
                                    ₹{product.price}
                                  </td>
                                  <td>{product.stock || 'NA'}</td>

                                  <td>
                                    <button
                                      className="btn btn-link p-0 me-2"
                                      data-bs-toggle="modal"
                                      data-bs-target="#editProductModal"
                                      onClick={() =>
                                        setSelectedProductId(product._id)
                                      }
                                    >
                                      <i className="ri-edit-line"></i>
                                    </button>
                                    <button
                                      className="btn btn-link p-0 text-theme"
                                      onClick={() => handleDelete(product._id)}
                                    >
                                      <i className="ri-delete-bin-line"></i>
                                    </button>
                                  </td>
                                  <td>
                                    <button
                                      className="btn btn-sm btn-solid"
                                      onClick={() => handleBuyNow(product._id)}
                                    >
                                      Buy
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="8">No products available.</td>
                              </tr>
                            )}
                            <EditProductModal
                              productId={selectedProductId} // Pass the selected product ID to the modal
                            />
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <Users />
                <div class="tab-pane fade" id="orders">
                  <div class="dashboard-table">
                    <div class="wallet-table">
                      <OrderDetails />
                    </div>
                  </div>
                </div>
             <ErrorCodes/>
                <Course />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashbord;
