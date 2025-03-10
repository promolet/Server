import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import './order.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://api.prumolet.com/api/orders');
      setOrders(response.data); // Set the fetched data directly
    } catch (err) {
      setError('Error fetching orders. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (orderId, currentStatus) => {
    setEditingOrderId(orderId);
    setUpdatedStatus(currentStatus);
  };

  const handleCancelClick = () => {
    setEditingOrderId(null);
    setUpdatedStatus('');
  };

  const handleUpdateClick = async (orderId) => {
    if (!updatedStatus) {
      alert('Please select a status to update.');
      return;
    }

    try {
      const response = await axios.put(
        `https://api.prumolet.com/api/admin/orders/${orderId}/status`,
        { status: updatedStatus },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 200) {
        alert('Order status updated successfully!');
        fetchOrders();
        handleCancelClick();
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update the order status. Please try again.');
    }
  };

  const handleDownloadExcel = () => {
    const formattedData = orders.flatMap((userOrder) =>
      userOrder.orders.map((order) => ({
        User_ID: userOrder.userId,
        Order_ID: order._id,
        Name: order.title,
        
        Address: `${order.address}, ${order.city}, ${order.state}, ${order.country}, Phone: ${order.phoneNumber}`,
        Payment_Option: order.paymentOption,
        Products: order.product.map((p) => `${p.productName} (Qty: ${p.quantity})`).join(', '),
        Total_Amount: `₹${order.totalAmount}`,
        Status: order.status,
        Order_Date: new Date(order.createdAt).toLocaleString(),
      }))
    );

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
    XLSX.writeFile(wb, 'Orders.xlsx');
  };

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="container mt-4">
      <h1>Order Details</h1>
      <button className="btn btn-success mb-3" onClick={handleDownloadExcel}>
        Download Excel
      </button>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Order ID</th>
              <th>Name</th>
              <th>Address</th>
              <th>Payment Option</th>
              <th>Products</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((userOrder) =>
              userOrder.orders.map((order) => (
                <tr key={order._id}>
                  <td>{userOrder.userId}</td>
                  <td>{order._id}</td>
                  <td>{order.title}</td>
                  <td>
                    {order.address}, {order.city}, {order.state}, {order.country}, Phone: {order.phoneNumber}
                  </td>
                  <td>{order.paymentOption}</td>
                  <td>
                    <ul>
                      {order.product.map((p) => (
                        <li key={p.productId}>
                          {p.productName} (Qty: {p.quantity})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>₹{order.totalAmount}</td>
                  <td>
                    {editingOrderId === order._id ? (
                      <select value={updatedStatus} onChange={(e) => setUpdatedStatus(e.target.value)}>
                        <option value="">Select Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    ) : (
                      <span>{order.status}</span>
                    )}
                  </td>
                  <td>
                    {editingOrderId === order._id ? (
                      <>
                        <button className="btn btn-success" onClick={() => handleUpdateClick(order._id)}>
                          Save
                        </button>
                        <button className="btn btn-secondary ml-2" onClick={handleCancelClick}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button className="btn btn-primary" onClick={() => handleEditClick(order._id, order.status)}>
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
