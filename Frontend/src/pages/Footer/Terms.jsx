import React from 'react';
import './Terms.css'
const TermsAndConditions = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
      <p className="mb-4">Effective Date: 01/01/2025</p>

      <p className="mb-4">
        Welcome to PrumoLET! These Terms and Conditions govern your use of our
        website, services, and any transactions made through our platform. By
        accessing or using our website, you agree to comply with these terms.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">1. Definitions</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>
          <strong>"PrumoLET"</strong> refers to our business providing PCB repairs,
          refurbished PCB sales, and skill development training.
        </li>
        <li>
          <strong>"User" or "You"</strong> refers to any individual or entity
          accessing our website or services.
        </li>
        <li>
          <strong>"Services"</strong> include PCB repairs, product sales, technical
          training courses, and related offerings.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">2. Use of Website & Services</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Provide accurate and complete information when required.</li>
        <li>Use our website only for lawful purposes.</li>
        <li>Not engage in fraudulent activities or disrupt website operations.</li>
      </ul>
      <p className="mb-4">
        We reserve the right to restrict or terminate access to users violating
        these terms.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">3. Product & Service Policies</h2>
      <h3 className="text-xl font-semibold mt-4 mb-2">3.1 PCB Repairs & Sales</h3>
      <ul className="list-disc ml-6 mb-4">
        <li>All refurbished PCBs undergo quality checks before being sold.</li>
        <li>We do not guarantee the availability of all PCB models at all times.</li>
        <li>Customers must provide clear details when requesting repairs.</li>
        <li>Any unauthorized tampering with repaired/refurbished PCBs voids the warranty.</li>
      </ul>

      <h3 className="text-xl font-semibold mt-4 mb-2">3.2 Training Courses</h3>
      <ul className="list-disc ml-6 mb-4">
        <li>Course enrollment is confirmed only after successful payment.</li>
        <li>Access to online courses is granted for 3 months from the date of purchase.</li>
        <li>Sharing login credentials or attempting to copy course materials is strictly prohibited.</li>
        <li>Certificates are issued only after successful course completion.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">4. Payments & Refunds</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>All payments are processed securely through authorized payment gateways.</li>
        <li>Refunds are available only for eligible cases, such as failed transactions or service unavailability.</li>
        <li>Course fees are non-refundable once access is granted.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">5. Intellectual Property</h2>
      <p className="mb-4">
        All content, including text, images, videos, and course materials, is owned by PrumoLET. Users may not copy,
        distribute, or modify any content without permission.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">6. Warranty & Liability</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Refurbished PCBs may come with a limited warranty (specific to each product).</li>
        <li>We are not responsible for damage caused by incorrect installation, mishandling, or external factors.</li>
        <li>PrumoLET is not liable for any direct or indirect damages arising from website use or service transactions.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">7. Privacy & Data Protection</h2>
      <p className="mb-4">
        We respect your privacy and handle personal data in accordance with our Privacy Policy.
      </p>
    </div>
  );
};

export default TermsAndConditions;
