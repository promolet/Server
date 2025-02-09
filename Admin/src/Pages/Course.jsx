import axios from "axios";
import React, { useEffect, useState } from "react";
import Addcourse from "./Addcourse";

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [updatedCourse, setUpdatedCourse] = useState({
    title: "",
    category: "",
    price: "",
  });

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

  // Open Edit Modal & Pre-fill Data
  const openEditModal = (course) => {
    setEditingCourse(course);
    setUpdatedCourse({
      title: course.title,
      category: course.category || "course",
      price: course.price,
    });
  };

  // Handle Edit Form Change
  const handleEditChange = (e) => {
    setUpdatedCourse({ ...updatedCourse, [e.target.name]: e.target.value });
  };

  // Update Course
  const updateCourse = async () => {
    try {
      await axios.put(`https://api.prumolet.com/courses/${editingCourse._id}`, updatedCourse);
      setCourses(
        courses.map((course) =>
          course._id === editingCourse._id ? { ...course, ...updatedCourse } : course
        )
      );
      setEditingCourse(null);
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  // Delete Course
  const deleteCourse = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await axios.delete(`https://api.prumolet.com/courses/${id}`);
        setCourses(courses.filter((course) => course._id !== id));
      } catch (error) {
        console.error("Error deleting course:", error);
      }
    }
  };

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
                  <th>Actions</th>
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
                      <td>
                        <button
                          className="btn btn-link p-0 me-2"
                          onClick={() => openEditModal(course)}
                          data-bs-toggle="modal"
                          data-bs-target="#editCourseModal"
                        >
                          <i className="ri-edit-line"></i>
                        </button>
                        <button
                          className="btn btn-link p-0 text-theme"
                          onClick={() => deleteCourse(course._id)}
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </td>
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

          {/* Edit Course Modal */}
          {editingCourse && (
            <div className="modal fade show d-block" id="editCourseModal">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Course</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setEditingCourse(null)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <label>Course Name</label>
                    <input
                      type="text"
                      name="title"
                      className="form-control"
                      value={updatedCourse.title}
                      onChange={handleEditChange}
                    />
                    <label>Category</label>
                    <input
                      type="text"
                      name="category"
                      className="form-control"
                      value={updatedCourse.category}
                      onChange={handleEditChange}
                    />
                    <label>Price</label>
                    <input
                      type="number"
                      name="price"
                      className="form-control"
                      value={updatedCourse.price}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setEditingCourse(null)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={updateCourse}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Course Orders Table */}
          <div className="table-responsive mt-4">
            <h4>Course Orders</h4>
            <table className="table cart-table order-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Course ID</th>
                  <th>Course Name</th>
                  <th>User Name</th>
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
