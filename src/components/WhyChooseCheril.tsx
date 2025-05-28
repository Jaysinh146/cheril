import React from 'react';
import { Shield, Clock, CreditCard, Users } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Secure Transactions',
    description: 'Every rental is protected with secure payments and verified users'
  },
  {
    icon: Clock,
    title: 'Flexible Duration',
    description: 'Rent items for as long as you need, from a day to months'
  },
  {
    icon: CreditCard,
    title: 'Best Prices',
    description: 'Save money by renting instead of buying expensive items'
  },
  {
    icon: Users,
    title: 'Community Trust',
    description: 'Join a trusted community of renters and lenders'
  }
];

const WhyChooseCheril = () => {
  return (
    <section className="py-16 px-6 bg-gradient-to-b from-[#ffebe3] to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute inset-0" style={{ 
          backgroundImage: `radial-gradient(#F7996E 1px, transparent 1px), radial-gradient(#F7996E 1px, transparent 1px)`,
          backgroundSize: `20px 20px`,
          backgroundPosition: `0 0, 10px 10px`
        }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[#181A2A] mb-4">
            Why Choose Cheril
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We make renting and lending items safe, easy, and affordable
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-[#F7996E] text-white rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6" />
              </div>
              
              <h3 className="text-xl font-semibold text-[#181A2A] mb-2">
                {feature.title}
              </h3>
              
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseCheril;
