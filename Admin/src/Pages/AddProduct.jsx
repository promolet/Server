import React, { useState } from 'react';

const AddProductModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    brand: '',
    model: '',
    partCode: '',
    capacity: '',
    capacityUnits: '',
    typeOfUnit: '',
    phase: '',
    ratedVoltage: '',
    stock: '',
    sku: '',
    images: [],
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(
      (file) =>
        file.size <= 5 * 1024 * 1024 && // Max 5MB
        ['image/jpeg', 'image/png'].includes(file.type) // Allowed formats
    );
    if (validFiles.length !== files.length) {
      setErrorMessage('Some files were rejected. Only JPG/PNG under 5MB are allowed.');
    } else {
      setErrorMessage('');
    }
    setFormData((prev) => ({
      ...prev,
      images: validFiles,
    }));
  };

  const validateForm = () => {
    const requiredFields = ['title', 'category', 'price', 'stock'];
    for (let field of requiredFields) {
      if (!formData[field]) {
        return `The field "${field}" is required.`;
      }
    }
    if (formData.images.length === 0) {
      return 'Please upload at least one image.';
    }
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsLoading(true);
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'images') {
        value.forEach((image) => form.append('multiImages', image));
      } else {
        form.append(key, value);
      }
    });

    try {
      const response = await fetch('https://api.prumolet.com/api/products/add', {
        method: 'POST',
        body: form,
      });

      const responseData = await response.json();
      if (response.ok) {
        setSuccessMessage('Product added successfully!');
        setErrorMessage('');
        setFormData({
          title: '',
          description: '',
          category: '',
          price: '',
          brand: '',
          model: '',
          partCode: '',
          capacity: '',
          capacityUnits: '',
          typeOfUnit: '',
          phase: '',
          ratedVoltage: '',
          stock: '',
          sku: '',
          images: [],
        });
        onSubmit(); // Notify parent component
      } else {
        setErrorMessage(responseData.message || 'Something went wrong.');
      }
    } catch (error) {
      setErrorMessage('Server error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal fade theme-modal-2" id="addProductModal">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title fw-semibold">Add Product</h3>
            <button type="button" className="btn-close" onClick={onClose}>
              <i className="ri-close-line"></i>
            </button>
          </div>
          <div className="modal-body">
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            <div className="row g-sm-4 g-2">
              {[
                'title',
                'description',
                'category',
                'price',
                'brand',
                'model',
                'partCode',
                'capacity',
                'capacityUnits',
                'typeOfUnit',
                'phase',
                'ratedVoltage',
                'stock',
                'sku',
              ].map((field) => (
                <div className="col-12" key={field}>
                  <div className="form-box">
                    <label htmlFor={field} className="form-label">
                      {field
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, (str) => str.toUpperCase())}
                    </label>
                    <input
                      type={
                        field === 'price' || field === 'capacity' || field === 'stock'
                          ? 'number'
                          : 'text'
                      }
                      className="form-control"
                      id={field}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      placeholder={`Enter Product ${field
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, (str) => str.toUpperCase())}`}
                    />
                  </div>
                </div>
              ))}
              <div className="col-12">
                <div className="form-box">
                  <label htmlFor="images" className="form-label">
                    Upload Images
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="images"
                    name="images"
                    multiple
                    onChange={handleFileChange}
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
                  disabled={isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
