import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import img from "../1.jpg";
import "./course.css"; // Ensure your CSS file is included

const Courses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Fetch courses from the backend
    const fetchCourses = async () => {
      try {
        const response = await axios.get("https://api.prumolet.com/courses");
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <>
      <div className="breadcrumb-section">
        <div className="container">
          <h2>Courses</h2>
          <nav className="theme-breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/">Home</a>
              </li>
              <li className="breadcrumb-item active">Courses</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="row1">
        {courses.map((course) => {
          const originalPrice = (course.price / 0.7).toFixed(2); // Assuming 30% off

          return (
            <div className="col-xl-4 col-6 col-grid-box1" key={course._id}>
              <div className="basic-product1 theme-product-1 position-relative">
                <div className="overflow-hidden">
                  <div className="img-wrapper">
                    {/* <Link to={`/course/${course._id}`}> */}
                      <img
                        src={`https://api.prumolet.com${course.images}`}
                        className="w-100 img-fluid lazyload"
                        alt={course.title}
                      />
                    {/* </Link> */}
                  </div>
                  <div className="product-detail">
                    <div>
                      {/* <Link className="product-title" to={`/course/${course._id}`}> */}
                        {course.title}
                      {/* </Link> */}
                      <h6>{course.description}</h6>
                      <h4 className="price">
                        ₹{course.price.toFixed(2)}
                        <del> ₹{originalPrice}</del>
                        <span className="discounted-price">30% Off</span>
                      </h4>
                    </div>
                    <ul className="offer-panel">
                      {course.offers &&
                        course.offers.map((offer, index) => (
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
        })}
      </div>
    </>
  );
};

export default Courses;
