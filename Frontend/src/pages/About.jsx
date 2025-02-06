import React from 'react';

const About = () => {
  return (
    <div className="about-page">
      {/* Breadcrumb Section */}
      <div class="breadcrumb-section">
        <div class="container">
            <h2>About us</h2>
            <nav class="theme-breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                        <a href="/">Home</a>
                    </li>
                    <li class="breadcrumb-item active">About us</li>
                </ol>
            </nav>
        </div>
    </div>
     
      <section className="about-content py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <img
                src="../assets/images/about/about-us.jpg"
                className="w-full rounded-xl shadow-md"
                alt="About Us"
              />
            </div>
            <div>
              <h4 className="text-2xl font-semibold mb-4 text-gray-800">
                <strong>PrumoLET</strong> - Trusted Name in Electronics Repair & Training
              </h4>
              <p className="mb-4 text-gray-700">
                PrumoLET is a trusted name in the field of electronics repair, refurbished PCB sales,
                and skill development training. With years of experience in servicing and repairing
                PCBs for air conditioners, refrigerators, washing machines, and other appliances,
                we have established ourselves as a leader in the industry.
              </p>
              <ul className="list-disc ml-5 text-gray-700">
                <li>Multi-Brand PCB Repair – Diagnosing and repairing PCBs from all major brands.</li>
                <li>Refurbished PCB Sales – High-quality, tested, and guaranteed PCBs at affordable prices.</li>
                <li>Technical Training – Expert-led courses through PrumoLET Skill Builders.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us bg-gray-50 py-10">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-6">Why Choose PrumoLET?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 shadow-md bg-white rounded-xl">
              <h4 className="font-semibold text-xl mb-2">Expertise & Experience</h4>
              <p>Backed by a team of skilled technicians.</p>
            </div>
            <div className="p-4 shadow-md bg-white rounded-xl">
              <h4 className="font-semibold text-xl mb-2">Quality Assurance</h4>
              <p>Every service and refurbished PCB comes with a quality guarantee.</p>
            </div>
            <div className="p-4 shadow-md bg-white rounded-xl">
              <h4 className="font-semibold text-xl mb-2">Customer-Centric Approach</h4>
              <p>We prioritize customer satisfaction and long-term solutions.</p>
            </div>
            <div className="p-4 shadow-md bg-white rounded-xl">
              <h4 className="font-semibold text-xl mb-2">Industry-Recognized Training</h4>
              <p>Learn from professionals and get certified.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section py-10 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
          <p className="max-w-3xl mx-auto text-gray-700">
            Our mission is to bridge the gap between learning and practical application by offering
            high-quality repairs, reliable refurbished products, and expert-led training programs.
            We aim to empower technicians, businesses, and individuals with the knowledge and
            resources they need to excel in the electronics industry.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
