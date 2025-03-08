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
        const response = await axios.get(
          `https://api.prumolet.com/courses/${id}`
        );
        setProduct(response.data);
        setLoading(false);

        // Check if the user has purchased the course
        const userId = localStorage.getItem("userId");
        if (userId) {
          const purchaseResponse = await axios.get(
            `https://api.prumolet.com/api/course/purchase-status?userId=${userId}&courseId=${id}`
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
  
    if (!userId) {
      alert("Please log in to purchase the course.");
      return;
    }
  
    if (product.price === 0) {
      // Directly mark as purchased if the course is free
      try {
        await axios.post("https://api.prumolet.com/api/course/data", {
          courseId: product._id,
          userId: userId,
          paymentId: "free-course",
        });
        alert("You have successfully enrolled in this free course!");
        setPurchased(true);
      } catch (error) {
        console.error("Error enrolling in free course:", error);
        alert("Failed to enroll in the free course. Try again!");
      }
      return;
    }
  
    // Razorpay payment flow for paid courses
    try {
      const response = await axios.post(
        "https://api.prumolet.com/create-order",
        {
          amount: product.price * 100,
          currency: "INR",
          receipt: `order_rcptid_${product._id}`,
        }
      );
  
      const { order_id } = response.data;
      const options = {
        key: "rzp_test_uG3TI1NzE3ByMl",
        amount: product.price * 100,
        currency: "INR",
        name: product.title,
        description: "Purchase Course",
        order_id: order_id,
        handler: async function (response) {
          await axios.post("https://api.prumolet.com/api/course/data", {
            courseId: product._id,
            userId: userId,
            paymentId: response.razorpay_payment_id,
          });
          alert("Payment Successful! Course Purchased.");
          setPurchased(true);
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
          contact: "9876543210",
        },
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
  const getYouTubeVideoId = (url) => {
    if (!url) return ""; // Return an empty string if the URL is undefined
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|embed\/|v\/|.*[?&]v=))([^"&?\/\s]{11})/);
    return match ? match[1] : "";
  };
  
  
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
            {product?.youtubeLink && (
  <iframe
    width="560"
    height="315"
    src={`${(product.youtubeLink)}`}
    title="YouTube video player"
    frameBorder="0"
    allowFullScreen
  ></iframe>
)}


            </div>
            <div className="col-lg-6">
              <div className="course-info">
                <h2 className="course-title">{product.title}</h2>
                <p className="course-description">{product.description}</p>
                <div className="course-price">
                <h3>{product.price === 0 ? "Free" : `₹ ${product.price}`}</h3>
                
                </div>
                {!purchased && (
                  <button
                    onClick={handleBuyNow}
                    className="btn btn-primary buy-btn"
                  >
                    Buy Now
                  </button>
                )}
              </div>
            </div>
          </div>
       
                   {/* Display Additional Videos After Purchase */}
{purchased && (
  <div className="additional-videos mt-4">
    <h3 className="video-section-title">Course Videos</h3>
    <div className="video-container">
      <iframe
        className="course-video"
        src="https://www.youtube.com/embed/fhgM4ZGiI3o?si=aaiDj_IpZQBEYwXg"
        title="Course Video 1"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <iframe
        className="course-video"
        src="https://www.youtube.com/embed/9BvoYsQdGw8?si=CZal8nMJky-HXbhM" 
        title="Course Video 2"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <iframe
        className="course-video"
        src="https://www.youtube.com/embed/pmixL0CLQI4?si=7q-FDkbBTdDdX0ZF"
        title="Course Video 3"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  </div>
)}


        </div>
      </section>
    </>
  );
};

export default CourseDetail;
