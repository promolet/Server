import React, { useEffect, useState } from "react";
import ProductCard from "../Product/ProductCard";
import axios from "axios";
import noUiSlider from "nouislider";
import "nouislider/dist/nouislider.css";

const Shop = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [products, setProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false); // Toggle filter visibility on mobile

  // Handle category change
  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    setSelectedCategories((prevSelected) =>
      checked
        ? [...prevSelected, value]
        : prevSelected.filter((cat) => cat !== value)
    );
  };

  // Handle price change
  const handlePriceChange = (newRange) => {
    setPriceRange(newRange);
    fetchProducts(newRange);
  };

  // Fetch products based on selected categories and price range
  const fetchProducts = async (range) => {
    try {
      const categoryQuery = selectedCategories.join(",");
      const response = await fetch(
        `https://api.prumolet.com/api/filter?categories=${categoryQuery}&minPrice=${range[0]}&maxPrice=${range[1]}`
      );
      const data = await response.json();
      setProducts(data);
      setShowFilters(false);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    const slider = document.getElementById("price-slider");
    noUiSlider.create(slider, {
      start: priceRange,
      connect: true,
      range: {
        min: 500,
        max: 50000,
      },
      step: 10,
    });

    slider.noUiSlider.on("update", (values) => {
      const [min, max] = values.map(Number);
      setPriceRange([min, max]);
      handlePriceChange([min, max]);
    });

    return () => {
      slider.noUiSlider.destroy();
    };
  }, []);

  return (
    <>
      <div className="breadcrumb-section">
        <div className="container">
          <h2>Shop</h2>
          <nav className="theme-breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/">Home</a>
              </li>
              <li className="breadcrumb-item active">Shop</li>
            </ol>
          </nav>
        </div>
      </div>

      <section className="section-b-space ratio_asos">
        <div className="collection-wrapper">
          <div className="container">
            <div className="row">
              <div className="top-banner-wrapper">
                <a href="#!">
                  <img
                    src="../assets/images/inner-page/banner/1.png"
                    className="img-fluid lazyload"
                    alt=""
                  />
                </a>
              </div>

              {/* Filter Button for Mobile */}
              <button
                className="filter-btn btn d-lg-none"
                onClick={() => setShowFilters(!showFilters)}
              >
                <i className="ri-filter-fill"></i> Filter
              </button>

              {/* Filter Section - Hidden on Mobile by Default */}
              <div
                className={`col-xl-3 col-lg-4 collection-filter ${
                  showFilters ? "show-mobile-filter" : ""
                }`}
              >
                <div className="collection-filter-block">
                  <button
                    className="collection-mobile-back btn d-lg-none"
                    onClick={() => setShowFilters(false)}
                  >
                    <span className="filter-back">Back</span>
                    <i className="ri-arrow-left-s-line"></i>
                  </button>
                  <div className="collection-collapse-block open">
                    <div
                      className="accordion collection-accordion"
                      id="accordionPanelsStayOpenExample"
                    >
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button
                            className="accordion-button pt-0"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#panelsStayOpen-collapseOne"
                            aria-expanded="true"
                            aria-controls="panelsStayOpen-collapseOne"
                          >
                            Categories
                          </button>
                        </h2>
                        <div
                          id="panelsStayOpen-collapseOne"
                          className="accordion-collapse collapse show"
                        >
                          <div className="accordion-body">
                            <ul className="collection-listing">
                              {[
                                "Inverter Air Conditioner PCB",
                                "Non-Inverter Air Conditioner PCB",
                                "Inverter Fridge PCB",
                                "Non-Inverter Fridge PCB",
                                "Washing Machine PCB",
                                "Motors",
                              ].map((category, index) => (
                                <li key={index}>
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      value={category}
                                      id={`checkbox${index + 1}`}
                                      onChange={handleCategoryChange}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor={`checkbox${index + 1}`}
                                    >
                                      {category}
                                    </label>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div class="accordion-item">
                        <h2 class="accordion-header">
                          <button
                            class="accordion-button"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#panelsStayOpen-collapseTwo"
                            aria-expanded="false"
                            aria-controls="panelsStayOpen-collapseTwo"
                          >
                            Brand{" "}
                          </button>
                        </h2>
                        <div
                          id="panelsStayOpen-collapseTwo"
                          class="accordion-collapse collapse show"
                        >
                          <div class="accordion-body">
                            <ul class="collection-listing">
                              <li>
                                <div class="form-check">
                                  <input
                                    class="form-check-input"
                                    type="checkbox"
                                    value=""
                                    id="checkbox11"
                                  />
                                  <label
                                    class="form-check-label"
                                    for="checkbox11"
                                  >
                                    Samsung
                                  </label>
                                </div>
                              </li>
                              <li>
                                <div class="form-check">
                                  <input
                                    class="form-check-input"
                                    type="checkbox"
                                    value=""
                                    id="checkbox12"
                                  />
                                  <label
                                    class="form-check-label"
                                    for="checkbox12"
                                  >
                                    LG
                                  </label>
                                </div>
                              </li>
                              <li>
                                <div class="form-check">
                                  <input
                                    class="form-check-input"
                                    type="checkbox"
                                    value=""
                                    id="checkbox13"
                                  />
                                  <label
                                    class="form-check-label"
                                    for="checkbox13"
                                  >
                                    Onida
                                  </label>
                                </div>
                              </li>
                              <li>
                                <div class="form-check">
                                  <input
                                    class="form-check-input"
                                    type="checkbox"
                                    value=""
                                    id="checkbox14"
                                  />
                                  <label
                                    class="form-check-label"
                                    for="checkbox14"
                                  >
                                    Mitsubishi
                                  </label>
                                </div>
                              </li>
                              <li>
                                <div class="form-check">
                                  <input
                                    class="form-check-input"
                                    type="checkbox"
                                    value=""
                                    id="checkbox15"
                                  />
                                  <label
                                    class="form-check-label"
                                    for="checkbox15"
                                  >
                                    O General
                                  </label>
                                </div>
                              </li>
                              <li>
                                <div class="form-check">
                                  <input
                                    class="form-check-input"
                                    type="checkbox"
                                    value=""
                                    id="checkbox16"
                                  />
                                  <label
                                    class="form-check-label"
                                    for="checkbox16"
                                  >
                                    Bluestar
                                  </label>
                                </div>
                              </li>
                              <li>
                                <div class="form-check">
                                  <input
                                    class="form-check-input"
                                    type="checkbox"
                                    value=""
                                    id="checkbox17"
                                  />
                                  <label
                                    class="form-check-label"
                                    for="checkbox17"
                                  >
                                    Carrier
                                  </label>
                                </div>
                              </li>
                              <li>
                                <div class="form-check">
                                  <input
                                    class="form-check-input"
                                    type="checkbox"
                                    value=""
                                    id="checkbox18"
                                  />
                                  <label
                                    class="form-check-label"
                                    for="checkbox18"
                                  >
                                    Godrej
                                  </label>
                                </div>
                              </li>
                              <li>
                                <div class="form-check">
                                  <input
                                    class="form-check-input"
                                    type="checkbox"
                                    value=""
                                    id="checkbox19"
                                  />
                                  <label
                                    class="form-check-label"
                                    for="checkbox19"
                                  >
                                    Marque
                                  </label>
                                </div>
                              </li>
                              <li>
                                <div class="form-check">
                                  <input
                                    class="form-check-input"
                                    type="checkbox"
                                    value=""
                                    id="checkbox20"
                                  />
                                  <label
                                    class="form-check-label"
                                    for="checkbox20"
                                  >
                                    Midea
                                  </label>
                                </div>
                              </li>
                              <li>
                                <div class="form-check">
                                  <input
                                    class="form-check-input"
                                    type="checkbox"
                                    value=""
                                    id="checkbox21"
                                  />
                                  <label
                                    class="form-check-label"
                                    for="checkbox21"
                                  >
                                    Kelvinator
                                  </label>
                                </div>
                              </li>
                              <li>
                                <div class="form-check">
                                  <input
                                    class="form-check-input"
                                    type="checkbox"
                                    value=""
                                    id="checkbox22"
                                  />
                                  <label
                                    class="form-check-label"
                                    for="checkbox23"
                                  >
                                    Kenstar
                                  </label>
                                </div>
                              </li>
                              <li>
                                <div class="form-check">
                                  <input
                                    class="form-check-input"
                                    type="checkbox"
                                    value=""
                                    id="checkbox24"
                                  />
                                  <label
                                    class="form-check-label"
                                    for="checkbox25"
                                  >
                                    Hitachi
                                  </label>
                                </div>
                              </li>
                              <li>
                                <div class="form-check">
                                  <input
                                    class="form-check-input"
                                    type="checkbox"
                                    value=""
                                    id="checkbox26"
                                  />
                                  <label
                                    class="form-check-label"
                                    for="checkbox26"
                                  >
                                    Heir
                                  </label>
                                </div>
                              </li>
                              <li>
                                <div class="form-check">
                                  <input
                                    class="form-check-input"
                                    type="checkbox"
                                    value=""
                                    id="checkbox27"
                                  />
                                  <label
                                    class="form-check-label"
                                    for="checkbox27"
                                  >
                                    Whirlpool
                                  </label>
                                </div>
                              </li>
                              <li>
                                <div class="form-check">
                                  <input
                                    class="form-check-input"
                                    type="checkbox"
                                    value=""
                                    id="checkbox28"
                                  />
                                  <label
                                    class="form-check-label"
                                    for="checkbox28"
                                  >
                                    Voltas
                                  </label>
                                </div>
                              </li>
                              <li>
                                <div class="form-check">
                                  <input
                                    class="form-check-input"
                                    type="checkbox"
                                    value=""
                                    id="checkbox29"
                                  />
                                  <label
                                    class="form-check-label"
                                    for="checkbox29"
                                  >
                                    Amazon
                                  </label>
                                </div>
                              </li>
                              <li>
                                <div class="form-check">
                                  <input
                                    class="form-check-input"
                                    type="checkbox"
                                    value=""
                                    id="checkbox30"
                                  />
                                  <label
                                    class="form-check-label"
                                    for="checkbox30"
                                  >
                                    Sansui
                                  </label>
                                </div>
                              </li>
                              <li>
                                <div class="form-check">
                                  <input
                                    class="form-check-input"
                                    type="checkbox"
                                    value=""
                                    id="checkbox31"
                                  />
                                  <label
                                    class="form-check-label"
                                    for="checkbox31"
                                  >
                                    Toshiba
                                  </label>
                                </div>
                              </li>
                              <li>
                                <div class="form-check">
                                  <input
                                    class="form-check-input"
                                    type="checkbox"
                                    value=""
                                    id="checkbox32"
                                  />
                                  <label
                                    class="form-check-label"
                                    for="checkbox32"
                                  >
                                    Daikin
                                  </label>
                                </div>
                              </li>
                              <li>
                                <div class="form-check">
                                  <input
                                    class="form-check-input"
                                    type="checkbox"
                                    value=""
                                    id="checkbox33"
                                  />
                                  <label
                                    class="form-check-label"
                                    for="checkbox33"
                                  >
                                    Videocon
                                  </label>
                                </div>
                              </li>
                              <li>
                                <div class="form-check">
                                  <input
                                    class="form-check-input"
                                    type="checkbox"
                                    value=""
                                    id="checkbox34"
                                  />
                                  <label
                                    class="form-check-label"
                                    for="checkbox34"
                                  >
                                    Vestar
                                  </label>
                                </div>
                              </li>
                              <li>
                                <div class="form-check">
                                  <input
                                    class="form-check-input"
                                    type="checkbox"
                                    value=""
                                    id="checkbox35"
                                  />
                                  <label
                                    class="form-check-label"
                                    for="checkbox35"
                                  >
                                    Lloyd
                                  </label>
                                </div>
                              </li>
                              <li>
                                <div class="form-check">
                                  <input
                                    class="form-check-input"
                                    type="checkbox"
                                    value=""
                                    id="checkbox36"
                                  />
                                  <label
                                    class="form-check-label"
                                    for="checkbox36"
                                  >
                                    Panasonic
                                  </label>
                                </div>
                              </li>
                              <li>
                                <div class="form-check">
                                  <input
                                    class="form-check-input"
                                    type="checkbox"
                                    value=""
                                    id="checkbox37"
                                  />
                                  <label
                                    class="form-check-label"
                                    for="checkbox37"
                                  >
                                    Reconnect
                                  </label>
                                </div>
                              </li>
                              <li>
                                <div class="form-check">
                                  <input
                                    class="form-check-input"
                                    type="checkbox"
                                    value=""
                                    id="checkbox38"
                                  />
                                  <label
                                    class="form-check-label"
                                    for="checkbox38"
                                  >
                                    IFB
                                  </label>
                                </div>
                              </li>
                              <li>
                                <div class="form-check">
                                  <input
                                    class="form-check-input"
                                    type="checkbox"
                                    value=""
                                    id="checkbox39"
                                  />
                                  <label
                                    class="form-check-label"
                                    for="checkbox39"
                                  >
                                    Sanyo
                                  </label>
                                </div>
                              </li>
                              <li>
                                <div class="form-check">
                                  <input
                                    class="form-check-input"
                                    type="checkbox"
                                    value=""
                                    id="checkbox40"
                                  />
                                  <label
                                    class="form-check-label"
                                    for="checkbox40"
                                  >
                                    Trane
                                  </label>
                                </div>
                              </li>
                              <li>
                                <div class="form-check">
                                  <input
                                    class="form-check-input"
                                    type="checkbox"
                                    value=""
                                    id="checkbox41"
                                  />
                                  <label
                                    class="form-check-label"
                                    for="checkbox41"
                                  >
                                    Other
                                  </label>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button
                            className="accordion-button"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#panelsStayOpen-collapseSix"
                            aria-expanded="false"
                            aria-controls="panelsStayOpen-collapseSix"
                          >
                            Price Range
                          </button>
                        </h2>
                        <div
                          id="panelsStayOpen-collapseSix"
                          className="accordion-collapse collapse show"
                        >
                          <div className="accordion-body price-body">
                            <div className="price-slider-wrapper">
                              <div
                                id="price-slider"
                                style={{ marginTop: "10px", width: "100%" }}
                              ></div>
                            </div>
                            <div className="price-range-display">
                              <p>
                                <strong>Price Range:</strong> ₹{priceRange[0]} -
                                ₹{priceRange[1]}
                              </p>
                            </div>
                            <div className="checkout-title">
                            <button
  className="d-flex align-items-center btn"
  onClick={() => {
    fetchProducts(priceRange); // Apply the filter
    setShowFilters(false); // Close the filter menu on mobile
  }}
>
  Apply Filter
</button>

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="collection-content col-xl-9 col-lg-8">
                <div className="page-main-content">
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="product-wrapper-grid">
                        <div className="row g-3 g-sm-4">
                          {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filter CSS */}
      <style jsx>{`
        @media (max-width: 991px) {
          .collection-filter {
            position: fixed;
            top: 0;
            left: -100%;
            width: 80%;
            height: 100vh;
            background: white;
            z-index: 999;
            overflow-y: auto;
            transition: 0.3s;
          }
          .show-mobile-filter {
            left: 0;
          }
        }
      `}</style>
    </>
  );
};

export default Shop;
