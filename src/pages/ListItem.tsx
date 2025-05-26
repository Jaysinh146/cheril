
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ListItemSteps from '@/components/ListItemSteps';

const ListItem = () => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white font-poppins">
      <Header />
      
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#181A2A] mb-4 font-poppins">
              List Your Verified Item
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-poppins">
              Join our trusted community of verified renters. Turn your unused items into income through our secure platform.
            </p>
          </div>

          <ListItemSteps />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ListItem;
