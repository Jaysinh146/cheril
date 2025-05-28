import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const lastUpdated = 'May 28, 2025';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-[#181A2A] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-poppins">Privacy Policy</h1>
          <p className="text-xl text-gray-300 font-poppins">Last updated: {lastUpdated}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="prose prose-lg text-gray-700 max-w-none font-poppins">
          <p className="text-gray-600 mb-8">
            At Cheril, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
            disclose, and safeguard your information when you use our platform.
          </p>

          <div className="space-y-12">
            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Information We Collect</h2>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                <p>
                  When you create an account, we collect information such as your name, email address, 
                  phone number, and payment information. For lenders, we may also collect business information 
                  and tax identification numbers.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-900 mt-6">Usage Data</h3>
                <p>
                  We automatically collect information about how you interact with our platform, including 
                  the pages you visit, the items you view, and your search queries.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-900 mt-6">Device Information</h3>
                <p>
                  We collect information about the devices you use to access our platform, including 
                  hardware model, operating system, browser type, and IP address.
                </p>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide, maintain, and improve our platform</li>
                <li>Process transactions and send related information</li>
                <li>Verify your identity and prevent fraud</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Send you technical notices, updates, and support messages</li>
                <li>Communicate with you about products, services, and promotions</li>
                <li>Monitor and analyze trends, usage, and activities</li>
                <li>Personalize your experience on our platform</li>
              </ul>
            </section>

            {/* How We Share Your Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">3. How We Share Your Information</h2>
              <p className="mb-4">We may share your information with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Other users as necessary to facilitate rentals (e.g., contact information for coordination)</li>
                <li>Service providers who perform services on our behalf</li>
                <li>Payment processors to complete transactions</li>
                <li>Law enforcement or government officials when required by law</li>
                <li>Third parties in connection with a merger, acquisition, or sale of assets</li>
              </ul>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal 
                information. However, no method of transmission over the Internet or electronic storage 
                is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            {/* Your Choices */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Your Choices</h2>
              <div className="space-y-4">
                <p>
                  <strong>Account Information:</strong> You may update or correct your account information 
                  at any time by logging into your account settings.
                </p>
                <p>
                  <strong>Marketing Communications:</strong> You can opt out of receiving promotional 
                  communications from us by following the instructions in those communications.
                </p>
                <p>
                  <strong>Cookies:</strong> Most web browsers are set to accept cookies by default. 
                  You can usually modify your browser settings to decline cookies if you prefer.
                </p>
              </div>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Children's Privacy</h2>
              <p>
                Our platform is not intended for children under 18 years of age. We do not knowingly 
                collect personal information from children under 18.
              </p>
            </section>

            {/* Changes to This Policy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes 
                by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            {/* Contact Us */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">8. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us through our Help Center.
              </p>
            </section>
            
            {/* Footer */}
            <div className="mt-20">
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
