import React, { useState, useEffect } from 'react';

const AddCourse = ({ product, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    images: [],
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        description: product.description || '',
        price: product.price || '',
        images: product.images || [],
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const uploadedFiles = Array.from(files);

    if (name === 'images') {
      if (uploadedFiles.some((file) => !file.type.startsWith('image/'))) {
        setErrorMessage('Only image files are allowed.');
        return;
      }
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedFiles],
      }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.price) {
      setErrorMessage('All required fields must be filled.');
      return;
    }

    const form = new FormData();
    form.append('title', formData.title);
    form.append('description', formData.description);
    form.append('price', formData.price);

    formData.images.forEach((image) => form.append('images', image));

    try {
      const response = await fetch('https://api.prumolet.com/api/course/add', {
        method: 'POST',
        body: form,
      });

      if (response.ok) {
        setSuccessMessage('Course saved successfully!');
        setErrorMessage('');
        setFormData({
          title: '',
          description: '',
          price: '',
          images: [],
        });
        onSubmit();
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Something went wrong.');
      }
    } catch (error) {
      setErrorMessage('Server error. Please try again.');
    }
  };

  return (
    <div className="modal fade theme-modal-2" id="AddCourseModal">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title fw-semibold">Add Course</h3>
            <button type="button" className="btn-close" onClick={onClose}>
              <i className="ri-close-line"></i>
            </button>
          </div>
          <div className="modal-body">
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            <div className="row g-sm-4 g-2">
              <div className="col-12">
                <div className="form-box">
                  <label htmlFor="title" className="form-label">Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter Course Title"
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="form-box">
                  <label htmlFor="description" className="form-label">Description *</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter Course Description"
                  ></textarea>
                </div>
              </div>
              <div className="col-12">
                <div className="form-box">
                  <label htmlFor="price" className="form-label">Price *</label>
                  <input
                    type="number"
                    className="form-control"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Enter Course Price"
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="form-box">
                  <label htmlFor="images" className="form-label">Upload Images</label>
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
              <button
                type="button"
                className="btn btn-solid"
                onClick={handleSubmit}
                data-bs-dismiss={!errorMessage ? 'modal' : undefined}
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

export default AddCourse;