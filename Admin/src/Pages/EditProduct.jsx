import axios from 'axios';
import React, { useState, useEffect } from 'react';

const EditProductModal = ({ productId, onClose, onSubmit }) => {
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
    stock: '',
    ratedVoltage: '',
    images: [],
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [product, setProduct] = useState(null);

  // Fetch product details when the modal is opened or productId changes
  useEffect(() => {
    if (productId) {
      fetchProduct(productId); // Fetch product details
    }
  }, [productId]);

  const fetchProduct = async (productId) => {
    try {
      const response = await axios.get(`https://api.prumolet.com/api/product/${productId}`);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  // Update formData when the product details are loaded
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        description: product.description || '',
        category: product.category || '',
        price: product.price || '',
        brand: product.brand || '',
        model: product.model || '',
        partCode: product.partCode || '',
        capacity: product.capacity || '',
        capacityUnits: product.capacityUnits || '',
        typeOfUnit: product.typeOfUnit || '',
        phase: product.phase || '',
        stock: product.stock || '',
        ratedVoltage: product.ratedVoltage || '',
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
    setFormData((prev) => ({
      ...prev,
      images: Array.from(e.target.files), // Save files as an array
    }));
  };

  const handleSubmit = async () => {
    const form = new FormData();
    form.append('title', formData.title);
    form.append('description', formData.description);
    form.append('category', formData.category);
    form.append('price', formData.price);
    form.append('brand', formData.brand);
    form.append('model', formData.model);
    form.append('partCode', formData.partCode);
    form.append('capacity', formData.capacity);
    form.append('capacityUnits', formData.capacityUnits);
    form.append('typeOfUnit', formData.typeOfUnit);
    form.append('phase', formData.phase);
    form.append('stock', formData.stock);
    form.append('ratedVoltage', formData.ratedVoltage);
    formData.images.forEach((image) => form.append('multiImages', image));

    try {
      const response = await axios.put(
        `https://api.prumolet.com/api/products/update/${productId}`,
        form
      );

      if (response.status === 200) {
        setSuccessMessage('Product updated successfully!');
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
          stock:'',
          ratedVoltage: '',
          images: [],
        });
        onSubmit();  // Refresh the product list or handle other post-submit logic
      }
    } catch (error) {
      setErrorMessage('Server error. Please try again.');
      console.error("Error updating product:", error);
    }
  };

  return (
    <div className="modal fade theme-modal-2" id="editProductModal" tabIndex="-1" aria-labelledby="editProductModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title fw-semibold">Edit Product</h3>
            <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={onClose}>
  <i className="ri-close-line"></i>
</button>
          </div>
          <div className="modal-body">
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            <div className="row g-sm-4 g-2">
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
                    placeholder="Enter Product Title"
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="form-box">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter Product Description"
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="form-box">
                  <label htmlFor="category" className="form-label">Category</label>
                  <input
                    type="text"
                    className="form-control"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Enter Product Category"
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="form-box">
                  <label htmlFor="price" className="form-label">Price</label>
                  <input
                    type="number"
                    className="form-control"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Enter Product Price"
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="form-box">
                  <label htmlFor="brand" className="form-label">Brand</label>
                  <input
                    type="text"
                    className="form-control"
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Enter Product Brand"
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="form-box">
                  <label htmlFor="model" className="form-label">Model</label>
                  <input
                    type="text"
                    className="form-control"
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="Enter Product Model"
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="form-box">
                  <label htmlFor="partCode" className="form-label">Part Code</label>
                  <input
                    type="text"
                    className="form-control"
                    id="partCode"
                    name="partCode"
                    value={formData.partCode}
                    onChange={handleChange}
                    placeholder="Enter Product Part Code"
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="form-box">
                  <label htmlFor="capacity" className="form-label">Capacity</label>
                  <input
                    type="number"
                    className="form-control"
                    id="capacity"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    placeholder="Enter Product Capacity"
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="form-box">
                  <label htmlFor="capacityUnits" className="form-label">Capacity Units</label>
                  <input
                    type="text"
                    className="form-control"
                    id="capacityUnits"
                    name="capacityUnits"
                    value={formData.capacityUnits}
                    onChange={handleChange}
                    placeholder="Enter Product Capacity Units"
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="form-box">
                  <label htmlFor="typeOfUnit" className="form-label">Type of Unit</label>
                  <input
                    type="text"
                    className="form-control"
                    id="typeOfUnit"
                    name="typeOfUnit"
                    value={formData.typeOfUnit}
                    onChange={handleChange}
                    placeholder="Enter Product Type of Unit"
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="form-box">
                  <label htmlFor="phase" className="form-label">Phase</label>
                  <input
                    type="text"
                    className="form-control"
                    id="phase"
                    name="phase"
                    value={formData.phase}
                    onChange={handleChange}
                    placeholder="Enter Product Phase"
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="form-box">
                  <label htmlFor="stock" className="form-label">stock</label>
                  <input
                    type="text"
                    className="form-control"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="Enter Product Phase"
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="form-box">
                  <label htmlFor="ratedVoltage" className="form-label">Rated Voltage</label>
                  <input
                    type="number"
                    className="form-control"
                    id="ratedVoltage"
                    name="ratedVoltage"
                    value={formData.ratedVoltage}
                    onChange={handleChange}
                    placeholder="Enter Product Rated Voltage"
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
              <div className="col-12">
                <button
                  type="button"
                  className="btn btn-solid"
                  onClick={handleSubmit}
                  data-bs-dismiss={errorMessage ? undefined : 'modal'}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
