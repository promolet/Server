import img from './1.jpg'
const products = [
    {
      id: 1,
      name: 'Gym Coords Set (Brown)',
      images: [
        img,
        img,
        img,
        img,
      ],
      price: 15.00,
      rating: 4,
      reviewsCount: 20,
      description: "Gym Coords Set offers a complete workout ensemble for the modern fitness enthusiast.",
      sku: 'SP18 (COPY)',
      weight: '150 Gms',
      stockStatus: 'In stock',
      quantityLeft: 40,
      deliveryInfo: 'Your order is likely to reach you within 7 days.',
      returnInfo: 'Hassle-free returns within 7 Days.',
      paymentInfo: {
        secureCheckout: '../assets/images/product-details/secure_payments.png',
        paymentMethods: '../assets/images/product-details/payments.png',
      },
      colors: [
        '../assets/images/product-details/product/17.jpg',
        '../assets/images/product-details/product/20.jpg',
        '../assets/images/product-details/product/21.jpg',
      ],
      stock: 10, // Assuming you have 10 items in stock
    },
    {
      id: 2,
      name: 'Gym Coords Set (Brown)',
      images: [
        '../assets/images/product-details/product/17.jpg',
        '../assets/images/product-details/product/18.jpg',
        '../assets/images/product-details/product/19.jpg',
        '../assets/images/product-details/product/18.jpg',
      ],
      price: 15.00,
      rating: 4,
      reviewsCount: 20,
      description: "Gym Coords Set offers a complete workout ensemble for the modern fitness enthusiast.",
      sku: 'SP18 (COPY)',
      weight: '150 Gms',
      stockStatus: 'In stock',
      quantityLeft: 40,
      deliveryInfo: 'Your order is likely to reach you within 7 days.',
      returnInfo: 'Hassle-free returns within 7 Days.',
      paymentInfo: {
        secureCheckout: '../assets/images/product-details/secure_payments.png',
        paymentMethods: '../assets/images/product-details/payments.png',
      },
      colors: [
        '../assets/images/product-details/product/17.jpg',
        '../assets/images/product-details/product/20.jpg',
        '../assets/images/product-details/product/21.jpg',
      ],
      stock: 10, // Assuming you have 10 items in stock
    }
  ];
  
  export default products;
  