import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './order.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingOrderDetailId, setEditingOrderDetailId] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://api.prumolet.com/api/admin/orders');
      setOrders(response.data.orders);
    } catch (err) {
      setError('Error fetching orders. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (orderDetailId, currentStatus) => {
    setEditingOrderDetailId(orderDetailId);
    setUpdatedStatus(currentStatus);
  };

  const handleCancelClick = () => {
    setEditingOrderDetailId(null);
    setUpdatedStatus('');
  };

  const handleUpdateClick = async (orderDetailId) => {
    if (!updatedStatus) {
      alert('Please select a status to update.');
      return;
    }

    try {
      const response = await axios.put(
        `https://api.prumolet.com/api/admin/orders/${orderDetailId}/status`,
        { status: updatedStatus },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        alert('Order status updated successfully!');
        fetchOrders(); // Refresh the orders list
        handleCancelClick();
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update the order status. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h1>Order Details</h1>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Payment Option</th>
              <th>Products</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) =>
              order.orderDetails.map((detail) => (
                <tr key={detail.orderDetailId}>
                  <td>{order.orderId || 'N/A'}</td>
                  <td>{order.user.name || 'N/A'}</td>
                  <td>{order.user.email || 'N/A'}</td>
                  <td>{detail.address || 'N/A'}</td>
                  <td>{detail.paymentOption || 'N/A'}</td>
                  <td>
                    <ul>
                      {detail.products.map((product) => (
                        <li key={product.id}>
                          {product.title} (Qty: {product.quantity})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>₹{detail.totalAmount || 'N/A'}</td>
                  <td>
                    {editingOrderDetailId === detail.orderDetailId ? (
                      <select
                        value={updatedStatus}
                        onChange={(e) => setUpdatedStatus(e.target.value)}
                      >
                        <option value="">Select Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    ) : (
                      <span>{detail.status || 'N/A'}</span>
                    )}
                  </td>
                  <td>
                    {editingOrderDetailId === detail.orderDetailId ? (
                      <>
                        <button
                          className="btn btn-success"
                          onClick={() => handleUpdateClick(detail.orderDetailId)}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-secondary ml-2"
                          onClick={handleCancelClick}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn btn-primary"
                        onClick={() =>
                          handleEditClick(detail.orderDetailId, detail.status)
                        }
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
