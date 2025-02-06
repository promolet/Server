import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from 'react-router-dom';
import s1 from '../images/PrumoLET Web Banners.png';
import s2 from '../images/PrumoLET Web Banners (5).png'
import s3 from '../images/PrumoLET Web Banners (1).png'
import s4 from '../images/PrumoLET Web Banners (2).png'
import b1 from '../images/PrumoLET Web Banners (4).png'
import b2 from '../images/PrumoLET Web Banners (6).png'
import './slider.css'
const slider = () => {
  const slides = [
    { id: 1, imgSrc: s2 },
    { id: 2, imgSrc: s1 },
    { id: 3, imgSrc: s3 },
    { id: 4, imgSrc: s4 },
  ];

  const banners = [
    { id: 1, imgSrc: b1, alt: "Banner 1", link: "/" },
    { id: 2, imgSrc: b2, alt: "Banner 2", link: "/" },
  ];

  return (
    <>
      <section className="p-0">
        <div id="homeCarousel" className="carousel slide" data-bs-ride="carousel">
          {/* Indicators */}
          <ol className="carousel-indicators">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                data-bs-target="#homeCarousel"
                data-bs-slide-to={index}
                className={index === 0 ? "active" : ""}
                aria-current={index === 0 ? "true" : "false"}
                aria-label={`Slide ${index + 1}`}
              ></button>
            ))}
          </ol>

          {/* Slides */}
          <div className="carousel-inner">
            {slides.map((slide, index) => (
              <div key={slide.id} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                <a href="/" className="d-block">
                  <img
                    src={slide.imgSrc}
                    alt={`Slide ${slide.id}`}
                    className="d-block w-100"
                    
                  />
                </a>
              </div>
            ))}
          </div>

          {/* Controls */}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#homeCarousel"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#homeCarousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </section>

      {/* Banner Section */}
      <section className="py-5">
        <div className="container">
          <div className="row gy-4">
            {banners.map((banner) => (
              <div key={banner.id} className="col-md-6">
                <a href={banner.link} className="d-block">
                  <img
                    src={banner.imgSrc}
                    className="img-fluid rounded shadow-sm"
                    alt={banner.alt}
                  />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offer Section */}
      <div className="title1 section-t-space">
      <h4>special offer</h4>
      <h2 className="title-inner1">Latest Drops</h2>

      <div className="container">
        <div className="row">
          <div className="col-lg-6 offset-lg-3">
            <div className="product-para">
              <p className="text-center">
                PrumoLET specializes in comprehensive air conditioner PCB sales, repairs, and training for industries and individuals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>


    </>
  );
};

export default slider;
