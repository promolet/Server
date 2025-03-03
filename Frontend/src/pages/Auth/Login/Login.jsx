import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
  
    const handleLogin = async (e) => {
      e.preventDefault();
  
      try {
        const response = await axios.post("https://api.prumolet.com/api/login", {
          email,
          password,
        });
  
        // Assuming the backend responds with a token and user data
        const { token, user } = response.data;
  
        // Store token in localStorage (or context)
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userId", user._id);
        window.location.href = '/'
      } catch (err) {
        console.error("Login error:", err);
        setError("Invalid email or password. Please try again.");
      }
    };
  return (
    <div>
      <div class="breadcrumb-section">
        <div class="container">
            <h2>Customer's login</h2>
            <nav class="theme-breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                        <a href="/">Home</a>
                    </li>
                    <li class="breadcrumb-item active">Customer's login</li>
                </ol>
            </nav>
        </div>
    </div>
    <section className="login-page section-b-space">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <h3>Login</h3>
            <div className="theme-card">
              <form className="theme-form" onSubmit={handleLogin}>
                {error && <p className="error-message">{error}</p>}
                <div className="form-box">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-box">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-solid">
                  Login
                </button>
              </form>
            </div>
          </div>
          <div className="col-lg-6 right-login">
            <h3>New Customer</h3>
            <div className="theme-card authentication-right">
              <h6 className="title-font">Create An Account</h6>
              <p>
                Sign up for a free account at our store. Registration is quick
                and easy. It allows you to be able to order from our shop. To
                start shopping, click register.
              </p>
              <a href="/register" className="btn btn-solid">
                Create an Account
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>
  )
}

export default Login
