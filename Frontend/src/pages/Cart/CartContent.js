// src/contexts/CartContext.js
import React, { createContext, useState, useEffect } from 'react';

// Create the Cart Context
export const CartContext = createContext();

// Create the Cart Provider
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // Load cart and wishlist from localStorage on mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setCart(savedCart);
    setWishlist(savedWishlist);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Function to add a product to the cart
  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (!existingProduct) {
      setCart([...cart, { ...product, quantity: 1 }]);
      alert(`${product.title} has been added to your cart!`);
    } else {
      alert(`${product.title} is already in your cart!`);
    }
  };

  // Function to remove a product from the cart
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // Function to update product quantity in the cart
  const updateCartQuantity = (id, change) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  // Function to clear the cart
  const clearCart = () => {
    setCart([]);
  };

  // Function to add a product to the wishlist
  const addToWishlist = (product) => {
    const existingProduct = wishlist.find((item) => item.id === product.id);
    if (!existingProduct) {
      setWishlist([...wishlist, product]);
      alert(`${product.title} has been added to your wishlist!`);
    } else {
      alert(`${product.title} is already in your wishlist!`);
    }
  };

  // Function to remove a product from the wishlist
  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        addToWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
