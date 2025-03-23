import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import axios from "axios";

const AddAddress = ({ onAddressAdded }) => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
  }, [userId, navigate]);

  const [formData, setFormData] = useState({
    title: "",
    address: "",
    phoneNumber: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [addresses, setAddresses] = useState([]); // Holds multiple addresses

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.address || !formData.phoneNumber) {
      setErrorMessage("Please fill all fields!");
      return;
    }

    try {
      const response = await axios.post("https://api.prumolet.com/api/addresses", {
        userId,
        ...formData,
      });

      setAddresses((prevAddresses) => [...prevAddresses, response.data]);
      onAddressAdded(response.data);

      setSuccessMessage("Address added successfully!");
      setFormData({
        title: "",
        address: "",
        phoneNumber: "",
        country: "",
        state: "",
        city: "",
        pincode: "",
      });
      setErrorMessage("");

      // Smooth scroll to top after submission
      window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (error) {
      setErrorMessage("Error adding address!");
      console.error("Error adding address:", error);
    }
  };

  return (
    <div>
      <div className="modal fade theme-modal-2" id="addAddress">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title fw-semibold">Add Address</h3>
              <button type="button" className="btn-close" data-bs-dismiss="modal">
                <i className="ri-close-line"></i>
              </button>
            </div>
            <div className="modal-body">
              {successMessage && <div className="alert alert-success">{successMessage}</div>}
              <div className="row g-sm-4 g-2">
                <div className="col-12">
                  <div className="form-box">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" name="title" value={formData.title} onChange={handleChange} placeholder="Enter Name" />
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-box">
                    <label htmlFor="address" className="form-label">Address</label>
                    <input type="text" className="form-control" id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Enter Address" />
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-box">
                    <label htmlFor="number" className="form-label">Phone Number</label>
                    <input type="number" className="form-control" id="number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Enter Your Phone Number" />
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-box">
                    <label className="form-label">Country</label>
                    <select className="form-select" name="country" value={formData.country} onChange={handleChange}>
                      <option value="">Select Country</option>
                      <option value="India">India</option>
                    </select>
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-box">
                    <label className="form-label">State</label>
                    <select className="form-select" name="state" value={formData.state} onChange={handleChange}>
                      <option value="">Select State</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                    </select>
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-box">
                    <label htmlFor="city" className="form-label">City</label>
                    <input type="text" className="form-control" id="city" name="city" value={formData.city} onChange={handleChange} placeholder="Enter City" />
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-box">
                    <label htmlFor="pin" className="form-label">Pincode</label>
                    <input type="number" className="form-control" id="pin" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Enter Pincode" />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <div className="col-12">
                  <button type="button" className="btn btn-solid" onClick={handleSubmit} data-bs-dismiss="modal">
                    Submit
                  </button>
                </div>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAddress;
