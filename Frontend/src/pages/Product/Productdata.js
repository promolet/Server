// products.js
import img from './1.jpg'
const products = [
  {
    id: 1,
    image: img,
    rating: 4.5,
    title: "Couture Edge",
    description:
      "Elevate your style with our stunning Mini Dress, the epitome of chic and sophistication. Crafted with precision and designed to turn heads, this dress boasts a figure-flattering silhouette that accentuates your curves in all the right places.",
    price: 4.34,
    originalPrice: 5.0,
    discount: "5% Off",
    colors: ["papayawhip", "burlywood", "gainsboro"],
    offers: ["Limited Time Offer: 5% off", "Free shipping on orders above $50"],
  },
  {
    id: 2,
    image: img,
    rating: 4.2,
    title: "Urban Style",
    description:
      "Stylish and comfortable, our Urban Style collection is perfect for the modern individual.",
    price: 3.99,
    originalPrice: 4.5,
    discount: "10% Off",
    colors: ["lightblue", "lightgreen", "coral"],
    offers: ["Limited Time Offer: 10% off", "Buy 1 Get 1 Free"],
  },
  // Add more products as needed
];

export default products;
