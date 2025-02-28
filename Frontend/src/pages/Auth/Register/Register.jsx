import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    password: '',
    role: 'student', // Default role
  });

  const [message, setMessage] = useState(''); // For success/error messages

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleRoleChange = (e) => {
    setFormData({ ...formData, role: e.target.value });
  };

  const createAccount = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'https://api.prumolet.com/api/create-account',
        formData
      );
      setMessage(response.data.message); // Success message
      setFormData({
        fname: '',
        lname: '',
        email: '',
        password: '',
        role: 'student', // Reset role to default
      });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div>
      {/* Breadcrumb Section */}
      <div className="breadcrumb-section">
        <div className="container">
          <h2>Create Account</h2>
          <nav className="theme-breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/">Home</a>
              </li>
              <li className="breadcrumb-item active">Create Account</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Registration Form */}
      <section className="login-page section-b-space">
        <div className="container">
          <h3>Create Account</h3>
          <div className="theme-card">
            <form className="theme-form" onSubmit={createAccount}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-box">
                    <label htmlFor="fname" className="form-label">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="fname"
                      placeholder="First Name"
                      value={formData.fname}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-box">
                    <label htmlFor="lname" className="form-label">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="lname"
                      placeholder="Last Name"
                      value={formData.lname}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-box">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-box">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Role Selection */}
              <div className="row">
                <div className="col-md-6">
                  <div className="form-box">
                    <label htmlFor="role" className="form-label">
                      Select Role
                    </label>
                    <select
                      className="form-control"
                      id="role"
                      value={formData.role}
                      onChange={handleRoleChange}
                      required
                    >
                      <option value="student">Student</option>
                      <option value="customer">Customer</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <button type="submit" className="btn btn-solid w-auto">
                  Create Account
                </button>
              </div>
            </form>

            {/* Success/Error Message */}
            {message && <p className="message">{message}</p>}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;
