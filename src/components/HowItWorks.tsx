
import React from 'react';
import { Search, Heart, TrendingUp } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Find What You Need',
    description: 'Browse through thousands of items from your neighborhood. Filter by category, price, and availability.',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    icon: Heart,
    title: 'Book & Enjoy',
    description: 'Select your dates, make a secure payment, and get the item delivered or pick it up yourself.',
    color: 'bg-red-100 text-red-600'
  },
  {
    icon: TrendingUp,
    title: 'Return & Earn',
    description: 'Return the item on time and rate your experience. List your own items to start earning!',
    color: 'bg-green-100 text-green-600'
  }
];

const HowItWorks = () => {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#181A2A] mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Getting started is simple. Follow these three easy steps to rent or lend items.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-8">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#F7996E] text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <div className={`w-20 h-20 ${step.color} rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="w-10 h-10" />
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-[#181A2A] mb-4">
                {step.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>

              {/* Connecting Line (except for last step) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gray-200 transform translate-x-1/2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
