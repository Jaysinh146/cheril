
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const benefits = [
  {
    title: 'Save Money',
    description: 'Rent instead of buying expensive items you use occasionally. Save up to 80% on premium products.',
    icon: '💰',
    color: 'bg-green-50 border-green-200'
  },
  {
    title: 'Earn Money',
    description: 'Turn your unused items into a steady income stream. Earn ₹500-5000 monthly from what you already own.',
    icon: '💎',
    color: 'bg-blue-50 border-blue-200'
  },
  {
    title: 'Eco-Friendly',
    description: 'Reduce waste and carbon footprint by sharing resources. Join the sustainable living movement.',
    icon: '🌱',
    color: 'bg-emerald-50 border-emerald-200'
  }
];

const Benefits = () => {
  return (
    <section className="py-16 px-6 bg-[#EDEDED]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[#181A2A] mb-4">
            Why Choose Cheril?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands who are already saving money, earning income, and living sustainably
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className={`${benefit.color} hover:shadow-xl transition-all duration-300 hover:scale-105 border-2`}>
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-[#181A2A] mb-4">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
