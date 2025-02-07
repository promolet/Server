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
        if (user.role !== "admin") {
          setError("Access denied. Only admin users can log in.");
          return;
        }
        // Store token in localStorage (or context)
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userId", user._id);  // Assuming the user object contains '_id'
        
        // Redirect to dashboard
        navigate("/");
      } catch (err) {
        console.error("Login error:", err);
        setError("Invalid email or password. Please try again.");
      }
    };
  return (
    <div>
      <div class="breadcrumb-section">
        <div class="container">
            <h2>admin's login</h2>
            <nav class="theme-breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                        <a href="/">Home</a>
                    </li>
                    <li class="breadcrumb-item active">admin's login</li>
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
          
        </div>
      </div>
    </section>
    </div>
  )
}

export default Login
