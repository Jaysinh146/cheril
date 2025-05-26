
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HowItWorks from '@/components/HowItWorks';

const HowItWorksPage = () => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white font-poppins">
      <Header />
      <div className="pt-20">
        <HowItWorks />
      </div>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
