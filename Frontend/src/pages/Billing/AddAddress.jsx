import React, { useState } from "react";
import axios from "axios";

const AddAddress = ({ userId, onAddressAdded }) => {
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    phoneNumber: "",
    country: "",
    state: "",
    city: "",
    pinCode: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [addresses, setAddresses] = useState([]); // State to hold multiple addresses
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);


  // Delete address
  const handleDeleteAddress = () => {
    axios
      .delete(`https://api.prumolet.com/api/addresses/${selectedAddress._id}`)
      .then(() => {
        setAddresses((prevAddresses) =>
          prevAddresses.filter((address) => address._id !== selectedAddress._id)
        );
        setDeleteModal(false);
      })
      .catch((error) => console.error("Error deleting address:", error));
  };
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
      const userId = localStorage.getItem("userId");
      const response = await axios.post("https://api.prumolet.com/api/addresses", {
        userId,
        ...formData,
      });

      // Update the addresses array with the new address
      setAddresses((prevAddresses) => [...prevAddresses, response.data]);

      // Pass the newly added address to the parent
      onAddressAdded(response.data); // Assuming the response contains the new address

      setSuccessMessage("Address added successfully!");
      setFormData({
        title: "",
        address: "",
        phoneNumber: "",
        country: "",
        state: "",
        city: "",
        pinCode: "",
      });
      setErrorMessage("");
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
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              >
                <i className="ri-close-line"></i>
              </button>
            </div>
            <div className="modal-body">
            
              {successMessage && (
                <div className="alert alert-success">{successMessage}</div>
              )}
         
              <div className="row g-sm-4 g-2">
              
                <div className="col-12">
                  <div className="form-box">
                    <label htmlFor="title" className="form-label">
                      Title
                    </label>
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
                <div className="col-12">
                  <div className="form-box">
                    <label htmlFor="address" className="form-label">
                      Address
                    </label>
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
                <div className="col-12">
                  <div className="form-box">
                    <label htmlFor="number" className="form-label">
                      Phone Number
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="number"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="Enter Your Phone Number"
                    />
                  </div>
                </div>
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
                      <option value="Arunachal Pradesh">
                        Arunachal Pradesh
                      </option>
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

                <div className="col-6">
                  <div className="form-box">
                    <label htmlFor="city" className="form-label">
                      City
                    </label>
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
                <div className="col-6">
                  <div className="form-box">
                    <label htmlFor="pin" className="form-label">
                      PinCode
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="pin"
                      name="pinCode"
                      value={formData.pinCode}
                      onChange={handleChange}
                      placeholder="Enter PinCode"
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">

                <div className="col-12">
                  <button
                    type="button"
                    className="btn btn-solid"
                    onClick={handleSubmit}
                    data-bs-dismiss="modal"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="modal fade theme-modal-2"
        id="delate-address"
        data-bs-backdrop="static"
        tabindex="-1"
      >
        <div class=" modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-body p-3">
              <div class="trash-box text-center">
                <i class="ri-delete-bin-line icon-box"></i>
                <h5 class="modal-title">Delete Item?</h5>
                <p>
                  This Item Will Be Deleted Permanently. You Can't Undo This
                  Action.
                </p>
                <div class="mt-3 d-flex align-items-center justify-content-center gap-2">
                  <button
                    class="btn btn-md btn-outline fw-bold"
                    data-bs-dismiss="modal"
                  >
                    No
                  </button>
                  <button
                    class="btn btn-solid"
                    data-bs-dismiss="modal"
                    onClick={handleDeleteAddress}
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Display all addresses */}
      <div className="address-list">
      {addresses.map((address) => (
  <li key={address._id}>
    <h5>{address.title}</h5>
    <p>
      {address.address.street}, {address.city}, {address.state}, {address.country}, {address.pinCode}
    </p>
    <p>
      <strong>Phone:</strong> {address.phoneNumber}
    </p>
  </li>
))}



      </div>
    </div>
  );
};

export default AddAddress;
