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
        const response = await axios.get("http://193.203.162.54:5500/courses");
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <>
    <div class="breadcrumb-section">
        <div class="container">
            <h2>Courses</h2>
            <nav class="theme-breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                        <a href="/">Home</a>
                    </li>
                    <li class="breadcrumb-item active">Courses</li>
                </ol>
            </nav>
        </div>
    </div>
    <div className="row">
      {courses.map((course) => (
        <div className="col-xl-4 col-6 col-grid-box" key={course._id}>
          <div className="basic-product theme-product-1 position-relative">
            <div className="overflow-hidden">
              {/* <Link to={`/course/${course._id}`} className="course-link"> */}
                <div className="img-wrapper">
                  <img
                     src={`http://193.203.162.54:5500${course.images}`}
                    className="w-100 img-fluid lazyload"
                    alt={course.title}
                  />
                  <div className="rating-label">
                    <i className="ri-star-fill"></i>
                    <span>{course.rating || "No rating"}</span>
                  </div>
                </div>
                <div className="product-detail">
                  <div>
                    <p className="product-title">{course.title}</p>
                    <h6>{course.description}</h6>
                    <h4 className="price">₹{course.price}</h4>
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
              {/* </Link> */}
            </div>
          </div>
        </div>
      ))}
    </div>
    </>
  );
};

export default Courses;
