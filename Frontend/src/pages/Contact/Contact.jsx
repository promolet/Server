import React, { useState } from "react";
import axios from "axios";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://api.prumolet.com/api/contact", formData);
      alert("Message sent successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send the message. Please try again.");
    }
  };

  return (
    
    <>
     <div class="breadcrumb-section">
        <div class="container">
            <h2>Contact us</h2>
            <nav class="theme-breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                        <a href="/">Home</a>
                    </li>
                    <li class="breadcrumb-item active">Contact us</li>
                </ol>
            </nav>
        </div>
    </div>
    <section className="contact-page">
      <div className="container">
        <div className="row g-sm-4 g-3">
          <div className="col-lg-5">
            <div className="contact-title">
              <h2>Get In Touch</h2>
              <p>
                We're here to help! Reach out to us with any questions, feedback, or inquiries, and we'll get
                back to you as soon as possible.
              </p>
            </div>
          </div>
          <div className="col-lg-7">
            <form className="theme-form contact-form" onSubmit={handleSubmit}>
              <div className="row g-4">
                <div className="col-12">
                  <div className="form-box">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-box">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-box">
                    <label>Phone</label>
                    <input
                      type="number"
                      name="phone"
                      className="form-control"
                      placeholder="Enter Your Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-box">
                    <label>Subject</label>
                    <input
                      type="text"
                      name="subject"
                      className="form-control"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-box">
                    <label>Write Your Message</label>
                    <textarea
                      rows="6"
                      name="message"
                      className="form-control"
                      placeholder="Write Your Message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-box">
                    <button className="btn btn-solid" type="submit">
                      Send Your Message
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default ContactPage;
