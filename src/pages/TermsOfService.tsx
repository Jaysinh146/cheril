import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';

const TermsOfService = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const effectiveDate = 'May 28, 2025';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-[#181A2A] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-poppins">Terms of Service</h1>
          <p className="text-xl text-gray-300 font-poppins">Effective Date: {effectiveDate}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="prose prose-lg text-gray-700 max-w-none font-poppins">
          <p className="text-gray-600 mb-8">
            Welcome to Cheril! These Terms of Service ("Terms") govern your access to and use of the Cheril 
            platform, including our website, mobile applications, and services (collectively, the "Service"). 
            By accessing or using our Service, you agree to be bound by these Terms.
          </p>

          <div className="space-y-12">n            {/* Accounts and Registration */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Accounts and Registration</h2>
              <div className="space-y-4">
                <p>
                  <strong>1.1 Account Creation:</strong> To use certain features of the Service, you must 
                  register for an account. You agree to provide accurate, current, and complete information 
                  during registration and to update such information as necessary.
                </p>
                <p>
                  <strong>1.2 Account Security:</strong> You are responsible for maintaining the confidentiality 
                  of your account credentials and for all activities that occur under your account. You agree 
                  to notify us immediately of any unauthorized use of your account.
                </p>
                <p>
                  <strong>1.3 Account Eligibility:</strong> You must be at least 18 years old to use our Service. 
                  By using the Service, you represent and warrant that you meet this requirement.
                </p>
              </div>
            </section>

            {/* Service Description */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Service Description</h2>
              <p>
                Cheril provides a platform that connects individuals who want to rent items ("Renters") with 
                individuals who want to lend items ("Lenders"). Cheril is not a party to any rental agreement 
                between Renters and Lenders and disclaims all liability arising from these transactions.
              </p>
            </section>

            {/* User Responsibilities */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">3. User Responsibilities</h2>
              <div className="space-y-4">
                <p>
                  <strong>3.1 For Lenders:</strong> You agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2 ml-4">
                  <li>Provide accurate descriptions of your items</li>
                  <li>Ensure items are safe and in good working condition</li>
                  <li>Honor all confirmed bookings</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
                
                <p className="mt-4">
                  <strong>3.2 For Renters:</strong> You agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2 ml-4">
                  <li>Use rented items only for their intended purpose</li>
                  <li>Return items in the same condition as received, excluding normal wear and tear</li>
                  <li>Pay all applicable fees and charges</li>
                  <li>Comply with all terms agreed upon with the Lender</li>
                </ul>
              </div>
            </section>

            {/* Payments and Fees */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Payments and Fees</h2>
              <div className="space-y-4">
                <p>
                  <strong>4.1 Service Fees:</strong> Cheril charges a service fee for each transaction. 
                  The current fee structure is available on our website and may be updated from time to time.
                </p>
                <p>
                  <strong>4.2 Payment Processing:</strong> All payments are processed through our third-party 
                  payment processors. You agree to provide accurate payment information and authorize us to 
                  charge your payment method for all applicable fees.
                </p>
                <p>
                  <strong>4.3 Taxes:</strong> You are responsible for all applicable taxes related to your 
                  use of the Service.
                </p>
              </div>
            </section>

            {/* Cancellations and Refunds */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Cancellations and Refunds</h2>
              <div className="space-y-4">
                <p>
                  <strong>5.1 Cancellation Policy:</strong> Cancellation policies vary by Lender and are 
                  specified in each listing. You are responsible for reviewing and understanding the 
                  cancellation policy before booking.
                </p>
                <p>
                  <strong>5.2 Refunds:</strong> Refund eligibility is determined by the cancellation policy 
                  selected by the Lender. Cheril will process refunds in accordance with these policies.
                </p>
              </div>
            </section>

            {/* Damage and Loss */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Damage and Loss</h2>
              <div className="space-y-4">
                <p>
                  <strong>6.1 Renter Responsibility:</strong> Renters are responsible for any damage to or 
                  loss of rented items during the rental period, excluding normal wear and tear.
                </p>
                <p>
                  <strong>6.2 Security Deposits:</strong> Lenders may require a security deposit. Any deductions 
                  from the security deposit must be for actual damages or losses and must be documented.
                </p>
                <p>
                  <strong>6.3 Disputes:</strong> In the event of a dispute regarding damage or loss, Cheril 
                  may mediate but is not responsible for resolving the dispute.
                </p>
              </div>
            </section>

            {/* Prohibited Activities */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Prohibited Activities</h2>
              <p className="mb-4">You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violate any laws or regulations</li>
                <li>Infringe on the rights of others</li>
                <li>Post false or misleading information</li>
                <li>Use the Service for any illegal or unauthorized purpose</li>
                <li>Interfere with or disrupt the Service</li>
                <li>Attempt to gain unauthorized access to the Service or related systems</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">8. Intellectual Property</h2>
              <p>
                The Service and its original content, features, and functionality are owned by Cheril and are 
                protected by international copyright, trademark, and other intellectual property laws. You may 
                not reproduce, distribute, or create derivative works without our prior written consent.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">9. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, Cheril shall not be liable for any indirect, incidental, 
                special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred 
                directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">10. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will provide notice of material changes 
                through the Service or by other means. Your continued use of the Service after such changes 
                constitutes your acceptance of the new Terms.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">11. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us through our Help Center.
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

export default TermsOfService;
