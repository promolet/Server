import axios from "axios";
import React, { useEffect, useState } from "react";
import Addcourse from "./Addcourse";

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [orders, setOrders] = useState([]);

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const response = await axios.get("https://api.prumolet.com/courses");
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // Fetch course orders
  const fetchOrders = async () => {
    try {
      const response = await axios.get("https://api.prumolet.com/courses-with-buyers");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching course orders:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchOrders();
  }, []);

  return (
    <div className="tab-pane fade" id="Addcourse">
      <div className="dashboard-table">
        <div className="wallet-table">
          <div className="top-sec">
            <h3>All Courses</h3>
            <button
              data-bs-toggle="modal"
              data-bs-target="#AddCourseModal"
              className="btn btn-sm btn-solid"
            >
              + Add New
            </button>
          </div>
          <Addcourse />
          {/* Course Table */}
          <div className="table-responsive">
            <h4>Courses</h4>
            <table className="table cart-table order-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Course Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  {/* <th>Edit/Delete</th> */}
                  {/* <th>Buy</th> */}
                </tr>
              </thead>
              <tbody>
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <tr key={course._id}>
                      <td className="image-box">
                        <img
                          src={`https://api.prumolet.com${course.images}`}
                          alt={course.title}
                          className="lazyloaded"
                        />
                      </td>
                      <td>{course.title}</td>
                      <td>{course.category || "course"}</td>
                      <td className="fw-bold text-theme">₹{course.price}</td>
                      {/* <td>
                        <button
                          className="btn btn-link p-0 me-2"
                          data-bs-toggle="modal"
                          data-bs-target="#editProductModal"
                        >
                          <i className="ri-edit-line"></i>
                        </button>
                        <button className="btn btn-link p-0 text-theme">
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </td> */}
                      {/* <td>
                        <button className="btn btn-sm btn-solid">Buy</button>
                      </td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No courses available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Course Orders Table */}
          <div className="table-responsive mt-4">
            <h4>Course Orders</h4>
            <table className="table cart-table order-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Course ID</th>
                  <th>Course Name</th>
                  <th>user name</th>
                  <th>Email</th>
                  <th>Purchase Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{order.courseId ? order.courseId._id : "N/A"}</td>
                      <td>{order.courseId ? order.courseId.title : "Unknown"}</td>
                      <td>{order.userId ? order.userId.fname : "Unknown"}</td>
                      <td>{order.userId ? order.userId.email : "Unknown"}</td>
                    
                      <td>{new Date(order.date).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">No course orders available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Course;
