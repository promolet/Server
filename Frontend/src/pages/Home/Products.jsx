import React, { useEffect, useState } from 'react';
import ProductCard from '../Product/ProductCard';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://193.203.162.54:5000/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); // Stop loading when data is fetched or an error occurs
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="section-b-space pt-0 ratio_asos">
      <div className="container">
        {loading ? ( // Display loading spinner if loading
          <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="g-3 g-md-4 row row-cols-2 row-cols-md-3 row-cols-xl-4">
            {products.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;
