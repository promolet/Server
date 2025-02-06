import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./CourseDetail.css";

const CourseDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`http://193.203.162.54:5000/courses/${id}`);
        setProduct(response.data);
        setLoading(false);

        // Check if the user has purchased the course
        const userId = localStorage.getItem("userId");
        if (userId) {
          const purchaseResponse = await axios.get(
            `http://193.203.162.54:5000/api/course/purchase-status?userId=${userId}&courseId=${id}`
          );
          setPurchased(purchaseResponse.data.purchased);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  const handleBuyNow = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const response = await axios.post("http://193.203.162.54:5000/create-order", {
        amount: product.price * 100,
        currency: "INR",
        receipt: `order_rcptid_${product._id}`,
      });

      const { order_id } = response.data;
      const options = {
        key: "rzp_test_uG3TI1NzE3ByMl",
        amount: product.price * 100,
        currency: "INR",
        name: product.title,
        description: "Purchase Course",
        order_id: order_id,
        handler: async function (response) {
          await axios.post("http://193.203.162.54:5000/api/course/data", {
            courseId: product._id,
            userId: userId,
            paymentId: response.razorpay_payment_id,
          });
          alert("Payment Successful! Course Purchased.");
          setPurchased(true);
        },
        prefill: { name: "User Name", email: "user@example.com", contact: "9876543210" },
        theme: { color: "#3399cc" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error in payment:", error);
      alert("Payment failed. Try again!");
    }
  };

  if (loading) return <h2>Loading...</h2>;
  if (!product) return <h2>Product not found</h2>;

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
      <section className="course-detail-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <iframe
                className="course-video"
                width="100%"
                height="315"
                src={`http://193.203.162.54:5000${product.videos[0]}`}
                title="Course Video"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
            <div className="col-lg-6">
              <div className="course-info">
                <h2 className="course-title">{product.title}</h2>
                <p className="course-description">{product.description}</p>
                <div className="course-price">
                  <h3>₹ {product.price}</h3>
                </div>
                {!purchased && (
                  <button onClick={handleBuyNow} className="btn btn-primary buy-btn">
                    Buy Now
                  </button>
                )}
              </div>
            </div>
          </div>
          {purchased && (
            <div className="additional-videos mt-4">
              <h3>Course Videos</h3>
              <ul>
                {product.videos.map((video, index) => (
                  <li key={index}>
                    <iframe
                      className="bonus-video"
                      width="100%"
                      height="200"
                      src={`http://193.203.162.54:5000${video}`}
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default CourseDetail;
