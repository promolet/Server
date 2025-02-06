import React from "react";
import img1 from '../images/Custom PCB Solutions.png'
import img2 from '../images/Multi-Brand PCB RepairsPCB Sales.png'
import img3 from '../images/Refurbished PCB Sales.png'
import img4 from '../images/Skill Development.png'
const services = () => {
  return (
    <div>
      <div class="breadcrumb-section">
        <div class="container">
          <h2>services</h2>
          <nav class="theme-breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <a href="/">Home</a>
              </li>
              <li class="breadcrumb-item active">Services</li>
            </ol>
          </nav>
        </div>
        <section class="about-page section-b-space">
          <div class="container">
            <div class="banner-section">
              <img
                src="../assets/images/about/vendor.jpg"
                class="img-fluid   lazyload"
                alt=""
              />
              <h3> Multi-Brand PCB Repairs</h3>
              <p>
                PrumoLET specializes in repairing PCBs
                for various electronic appliances, including inverter and
                non-inverter ACs, refrigerators, washing machines, and motor
                controllers. Our team ensures high-quality repairs, using
                advanced diagnostics and OEM-grade components to restore
                functionality. We handle chip-level repairs, component
                replacements, and firmware updates, making sure your PCB works
                like new.
              </p>
              <h3>Refurbished PCB Sales</h3>
              <p>
                 Looking for a cost-effective solution? We
                offer refurbished PCBs for major appliance brands, ensuring they
                pass strict quality checks and functionality tests before sale.
                Our refurbished PCBs provide a budget-friendly alternative to
                new ones, with a limited warranty for peace of mind.
              </p>
              <h3>Skill Development & Training (PrumoLET Skill Builders) </h3>
              <p>
               Through
                PrumoLET Skill Builders, we offer technical training courses in
                PCB repair, troubleshooting, and motor control. Our courses are
                designed for beginners and professionals, providing a structured
                learning path with practical experience. Students can enroll
                online and get access to our self-paced training modules.
              </p>
              <h3>
              Custom PCB Solutions
              </h3>
              <p>
                 Need a custom-built PCB for your
                application? Our engineers design and manufacture tailor-made
                PCBs, optimizing them for efficiency, durability, and
                performance. Whether you need modifications or a new PCB design,
                we provide consultation and prototyping services.
              </p>
              <p> E-Commerce for PCBs & Courses</p>
              <p>
                Our e-commerce platform allows
                customers to purchase refurbished PCBs, repair services, and
                skill development courses in one place. Students enrolling in
                courses will be redirected to our institute’s website, ensuring
                a smooth learning experience. All transactions are secure, and
                order tracking is available through our online portal.
              </p>
            </div>
          </div>
        </section>
        <section class="service-section">
          <div class="service-container">
            <div
              class="service-item"
              onclick="window.location.href='contact.html'"
            >
              <h3 class="service-title">Multi-Brand PCB Repairs</h3>
              <img
                src={img2}
                alt="Service Image 1"
                class="service-image"
              />
              <p class="service-description">
                We repair PCBs for ACs, refrigerators, washing machines, and
                other appliances, ensuring high-quality restoration.
              </p>
            </div>
            <div
              class="service-item"
              onclick="window.location.href='contact.html'"
            >
              <h3 class="service-title">Refurbished PCB Sales</h3>
              <img
                src={img3}
                alt="Service Image 2"
                class="service-image"
              />
              <p class="service-description">
                Purchase tested and quality-assured refurbished PCBs at
                affordable prices with warranty options.
              </p>
            </div>
            <div
              class="service-item"
              onclick="window.location.href='contact.html'"
            >
              <h3 class="service-title">Skill Development & Training</h3>
              <img
                src={img4}
                alt="Service Image 3"
                class="service-image"
              />
              <p class="service-description">
                Join PrumoLET Skill Builders and gain hands-on training in PCB
                repairs, troubleshooting, and motor control..
              </p>
            </div>
            <div
              class="service-item"
              onclick="window.location.href='contact.html'"
            >
              <h3 class="service-title">Custom PCB Solutions</h3>
              <img
                src={img1}
                alt="Service Image 4"
                class="service-image"
              />
              <p class="service-description">
                We provide custom-built PCB solutions and modifications for
                specialized applications.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default services;
