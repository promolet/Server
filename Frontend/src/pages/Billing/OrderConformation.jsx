import React from 'react';
import './OrderConfirmation.css'; // Separate CSS file for styling

const OrderConfirmation = () => {
  const orderDetails = {
    orderId: '12345ABC',
    items: [
      { name: 'Sports Shoes', quantity: 1, price: '₹2,000' },
      { name: 'Running T-Shirt', quantity: 2, price: '₹1,500' },
    ],
    total: '₹3,500',
    shippingAddress: '123, Main Street, New Delhi, India',
  };

  return (
    <div className="order-confirmation">
   
      <main className="main">
        <div className="message">
          <i className="check-icon">✔️</i>
          <h1>Thank you for your order!</h1>
          <p>Your order has been placed successfully.</p>
        </div>
        

        
        
      </main>
      

    </div>
  );
};

export default OrderConfirmation;
