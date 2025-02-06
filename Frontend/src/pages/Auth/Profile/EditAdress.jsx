import axios from 'axios';
import React, { useState, useEffect } from 'react';

const EditAddressModal = ({ addressId, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    phoneNumber: '',
    country: '',
    state: '',
    city: '',
    pinCode: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [address, setAddress] = useState(null);

  // Fetch address details when the modal is opened or addressId changes
  useEffect(() => {
    if (addressId) {
      fetchAddressDetails(addressId);
    }
  }, [addressId]);

  const fetchAddressDetails = async (id) => {
    try {
      const userId = localStorage.getItem('userId');

      const response = await axios.get(
        `https://api.prumolet.com/api/addresses/${userId}/${id}`
      );
      
      if (response.data) {
        setAddress(response.data); // Assuming response data is the address object
      } else {
        setErrorMessage('Address not found');
      }
    } catch (error) {
      console.error('Error fetching address details:', error);
      setErrorMessage('Failed to load address details.');
    }
  };

  // Update formData when address details are loaded
  useEffect(() => {
    if (address) {
      setFormData({
        title: address.title || '',
        address: address.address || '',
        phoneNumber: address.phoneNumber || '',
        country: address.country || '',
        state: address.state || '',
        city: address.city || '',
        pinCode: address.pinCode || '',
      });
    }
  }, [address]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.put(
        `https://api.prumolet.com/api/addresses/${userId}/${addressId}`,
        formData
      );

      if (response.status === 200) {
        setSuccessMessage('Address updated successfully!');
        setErrorMessage('');
        onSubmit(); // Trigger any post-submit logic
        onClose(); // Close the modal
      }
    } catch (error) {
      console.error('Error updating address:', error);
      setErrorMessage('Failed to update address. Please try again.');
    }
  };

  return (
    <div
      className="modal fade theme-modal-2"
      id="edit-address"
      tabIndex="-1"
      aria-labelledby="editAddressModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title fw-semibold">Edit Address</h3>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              onClick={onClose}
            >
              <i className="ri-close-line"></i>
            </button>
          </div>
          <div className="modal-body">
            {errorMessage && (
              <div className="alert alert-danger">{errorMessage}</div>
            )}
            {successMessage && (
              <div className="alert alert-success">{successMessage}</div>
            )}
            <div className="row g-sm-4 g-2">
              {/* Title */}
              <div className="col-12">
                <div className="form-box">
                  <label htmlFor="title" className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter Title"
                  />
                </div>
              </div>
              {/* Address */}
              <div className="col-12">
                <div className="form-box">
                  <label htmlFor="address" className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter Address"
                  />
                </div>
              </div>
              {/* Phone Number */}
              <div className="col-12">
                <div className="form-box">
                  <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter Phone Number"
                  />
                </div>
              </div>
              {/* Country */}
              <div className="col-6">
                <div className="form-box">
                  <label className="form-label">Country</label>
                  <select
                    className="form-select"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                  >
                    <option value="">Select Country</option>
                    <option value="India">India</option>
                  </select>
                </div>
              </div>
              {/* State */}
              <div className="col-6">
  <div className="form-box">
    <label className="form-label">State</label>
    <select
      className="form-select"
      name="state"
      value={formData.state}
      onChange={handleChange}
    >
      <option value="">Select State</option>
      <option value="Andhra Pradesh">Andhra Pradesh</option>
      <option value="Arunachal Pradesh">Arunachal Pradesh</option>
      <option value="Assam">Assam</option>
      <option value="Bihar">Bihar</option>
      <option value="Chhattisgarh">Chhattisgarh</option>
      <option value="Goa">Goa</option>
      <option value="Gujarat">Gujarat</option>
      <option value="Haryana">Haryana</option>
      <option value="Himachal Pradesh">Himachal Pradesh</option>
      <option value="Jharkhand">Jharkhand</option>
      <option value="Karnataka">Karnataka</option>
      <option value="Kerala">Kerala</option>
      <option value="Madhya Pradesh">Madhya Pradesh</option>
      <option value="Maharashtra">Maharashtra</option>
      <option value="Manipur">Manipur</option>
      <option value="Meghalaya">Meghalaya</option>
      <option value="Mizoram">Mizoram</option>
      <option value="Nagaland">Nagaland</option>
      <option value="Odisha">Odisha</option>
      <option value="Punjab">Punjab</option>
      <option value="Rajasthan">Rajasthan</option>
      <option value="Sikkim">Sikkim</option>
      <option value="Tamil Nadu">Tamil Nadu</option>
      <option value="Telangana">Telangana</option>
      <option value="Tripura">Tripura</option>
      <option value="Uttar Pradesh">Uttar Pradesh</option>
      <option value="Uttarakhand">Uttarakhand</option>
      <option value="West Bengal">West Bengal</option>
    </select>
  </div>
</div>

              {/* City */}
              <div className="col-6">
                <div className="form-box">
                  <label htmlFor="city" className="form-label">City</label>
                  <input
                    type="text"
                    className="form-control"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter City"
                  />
                </div>
              </div>
              {/* Pin Code */}
              <div className="col-6">
                <div className="form-box">
                  <label htmlFor="pinCode" className="form-label">Pin Code</label>
                  <input
                    type="text"
                    className="form-control"
                    id="pinCode"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleChange}
                    placeholder="Enter Pin Code"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-solid"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAddressModal;
