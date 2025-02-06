import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    const fetchCartDetails = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await axios.get(
          `http://193.203.162.54:5500/api/cart/${userId}`
        );

        if (response.data.cart && response.data.cart.products) {
          const productsWithDetails = await fetchProductDetails(
            response.data.cart.products
          );
          setCart(productsWithDetails);
          calculateSubtotal(productsWithDetails);
        } else {
          console.error('Cart or products not found in the response');
        }
      } catch (error) {
        console.error('Error fetching cart details:', error);
      }
    };

    fetchCartDetails();
  }, []);

  const fetchProductDetails = async (cartItems) => {
    const updatedCartItems = await Promise.all(
      cartItems.map(async (item) => {
        try {
          const productResponse = await axios.get(
            `http://193.203.162.54:5500/api/${item.productId}`
          );
          return { ...item, productDetails: productResponse.data };
        } catch (error) {
          console.error('Error fetching product details:', error);
          return item;
        }
      })
    );
    return updatedCartItems;
  };

  const calculateSubtotal = (cartItems) => {
    const total = cartItems.reduce((acc, item) => {
      const price = item.productDetails?.price || 0;
      const quantity = item.quantity || 1;
      return acc + price * quantity;
    }, 0);
    setSubtotal(total);
  };

  const removeFromCart = async (productId) => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.delete(
        `http://193.203.162.54:5500/api/cart/${userId}/${productId}`
      );
      if (response.status === 200) {
        const updatedCart = cart.filter(
          (item) => item.productId !== productId
        );
        setCart(updatedCart);
        calculateSubtotal(updatedCart);
      } else {
        console.error('Failed to remove product from cart:', response.data);
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const updateCartQuantity = async (productId, change) => {
    try {
      const userId = localStorage.getItem('userId');
      const updatedCart = cart.map((item) => {
        if (item.productId === productId) {
          return { ...item, quantity: Math.max(item.quantity + change, 1) };
        }
        return item;
      });

      setCart(updatedCart);
      calculateSubtotal(updatedCart);

      const updatedItem = updatedCart.find(
        (item) => item.productId === productId
      );

      await axios.put(`http://193.203.162.54:5500/api/cart/update/${userId}`, {
        productId,
        quantity: updatedItem.quantity,
      });
    } catch (error) {
      console.error('Error updating cart quantity:', error);
    }
  };

  return (
    <div>
      <div className="breadcrumb-section">
        <div className="container">
          <h2>Cart</h2>
          <nav className="theme-breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/">Home</a>
              </li>
              <li className="breadcrumb-item active">Cart</li>
            </ol>
          </nav>
        </div>
      </div>
      <section className="cart-section section-b-space">
        <div className="container">
          <div className="table-responsive">
            <table className="table cart-table">
              <thead>
                <tr className="table-head">
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.productId}>
                    <td>
                      <img
                        src={item.productDetails.imageUrl || ''}
                        className="img-fluid"
                        alt={item.productDetails.name || 'Product'}
                      />
                    </td>
                    <td>{item.productDetails.title || 'Product Name'}</td>
                    <td>${item.productDetails.price || 0}</td>
                    <td>
                      <div className="qty-box">
                        <button
                          className="btn qty-btn-minus"
                          onClick={() =>
                            updateCartQuantity(item.productId, -1)
                          }
                        >
                          -
                        </button>
                        <span>{item.quantity || 1}</span>
                        <button
                          className="btn qty-btn-plus"
                          onClick={() =>
                            updateCartQuantity(item.productId, 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>
                      $
                      {(
                        (item.productDetails.price || 0) *
                        (item.quantity || 1)
                      ).toFixed(2)}
                    </td>
                    <td>
                      <button
                        className="btn remove-btn"
                        onClick={() => removeFromCart(item.productId)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4" className="text-right">
                    Subtotal:
                  </td>
                  <td>${subtotal.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div class="row cart-buttons">
                <div class="col-6">
                    <a href="/" class="btn btn-solid text-capitalize">continue
                        shopping</a>
                </div>
                <div class="col-6">
                    <a href="/billing" class="btn btn-solid text-capitalize">check out</a>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Cart;
