import axios from 'axios';
import React, { useState, useEffect } from 'react';

const ErrorCodes = () => {
  const [errors, setErrors] = useState([]);
  const [company, setCompany] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [description, setDescription] = useState("");

  const fetchErrors = async () => {
    try {
      const response = await axios.get('https://api.prumolet.com/errorCode');
      setErrors(response.data); // Set the fetched error codes in the state
    } catch (error) {
      console.error("Error fetching error codes:", error);
    }
  };

  useEffect(() => {
    fetchErrors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://api.prumolet.com/api/errorcode', {
        company,
        errorCode,
        description
      });
      setErrors([...errors, response.data]); // Add new error to state
      setCompany("");
      setErrorCode("");
      setDescription("");
    } catch (error) {
      console.error("Error adding error code:", error);
    }
  };

  // Function to handle delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://api.prumolet.com/api/errorcode/${id}`);
      setErrors(errors.filter(error => error._id !== id)); // Remove from state
    } catch (error) {
      console.error("Error deleting error code:", error);
    }
  };

  return (
    <div className="tab-pane fade" id="AcerrorCode">
      <div className="dashboard-table">
        <div className="wallet-table">
          <div className="top-sec">
            <h3>All Error Codes</h3>
            <button
              data-bs-toggle="modal"
              data-bs-target="#AddErrorCodeModal"
              className="btn btn-sm btn-solid"
            >
              + Add New Error Code
            </button>
          </div>
          
          <div className="modal fade" id="AddErrorCodeModal" tabIndex="-1" aria-labelledby="AddErrorCodeModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="AddErrorCodeModalLabel">Add New Error Code</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="company" className="form-label">Company</label>
                      <input
                        type="text"
                        className="form-control"
                        id="company"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="errorCode" className="form-label">Error Code</label>
                      <input
                        type="text"
                        className="form-control"
                        id="errorCode"
                        value={errorCode}
                        onChange={(e) => setErrorCode(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table cart-table order-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Error Code</th>
                  <th>Description</th>
                  <th>Action</th> {/* New column for delete button */}
                </tr>
              </thead>
              <tbody>
                {Array.isArray(errors) && errors.length > 0 ? (
                  errors.map((error) => (
                    <tr key={error._id}>
                      <td>{error.company}</td>
                      <td>{error.errorCode}</td>
                      <td>{error.description}</td>
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(error._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No error codes available.</td>
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

export default ErrorCodes;
