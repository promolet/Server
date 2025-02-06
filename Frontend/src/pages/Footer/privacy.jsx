import React from 'react';
import './Privacy.css'
const PrivacyPolicy = () => {
  return (
    <>
    <div class="breadcrumb-section">
        <div class="container">
            <h2>Privacy Policy</h2>
            <nav class="theme-breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                        <a href="/">Home</a>
                    </li>
                    <li class="breadcrumb-item active">Privacy Policy</li>
                </ol>
            </nav>
        </div>
    </div>
    <div className="max-w-4xl mx-auto p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-6">Effective Date: 01/01/2025</p>

      <p className="mb-4">
        PrumoLET ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, share, and safeguard your personal information when you visit our website or use our services.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">1. Information We Collect</h2>

      <h3 className="text-xl font-semibold mt-4">1.1 Personal Information</h3>
      <p className="mb-2">When you interact with our website or services, we may collect personal details such as:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Name</li>
        <li>Email address</li>
        <li>Phone number</li>
        <li>Billing and shipping address</li>
        <li>Payment information (processed securely)</li>
        <li>Login credentials (if applicable)</li>
      </ul>

      <h3 className="text-xl font-semibold mt-4">1.2 Non-Personal Information</h3>
      <p className="mb-2">We also collect non-identifiable data such as:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Browser type and version</li>
        <li>IP address</li>
        <li>Device information</li>
        <li>Website usage statistics through cookies and analytics tools</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
      <ul className="list-disc list-inside mb-4">
        <li>To process orders and service requests</li>
        <li>To manage course enrollments and student records</li>
        <li>To provide customer support and respond to inquiries</li>
        <li>To improve website performance and user experience</li>
        <li>To send promotional updates and offers (only with consent)</li>
        <li>To prevent fraudulent activities and ensure security</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">3. Sharing Your Information</h2>
      <p className="mb-4">
        We <strong>do not sell or trade</strong> your personal information. However, we may share data with:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Payment Processors: For secure transaction processing.</li>
        <li>Service Providers: For website hosting, analytics, and customer support.</li>
        <li>Legal Authorities: If required by law or to protect our rights.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">4. Data Security</h2>
      <p className="mb-4">
        We take appropriate measures to safeguard your data against unauthorized access, loss, or misuse. However, no online system is completely secure, so we encourage users to take precautions when sharing personal information online.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">5. Your Rights & Choices</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Access, update, or delete your personal information.</li>
        <li>Opt-out of promotional communications.</li>
        <li>Disable cookies through browser settings.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">6. Third-Party Links</h2>
      <p className="mb-4">
        Our website may contain links to third-party sites (such as payment gateways or social media platforms). We are not responsible for their privacy practices, so we recommend reviewing their policies separately.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">7. Changes to This Privacy Policy</h2>
      <p className="mb-4">
        We may update this policy periodically. Any changes will be posted on this page with a revised effective date.
      </p>
    </div>
    </>
  );
};

export default PrivacyPolicy;
