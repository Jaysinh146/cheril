
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    // Handle newsletter signup logic here
    setEmail('');
  };

  return (
    <section className="py-16 px-6 bg-[#181A2A]">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Stay in the Loop
        </h2>
        <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
          Get notified about new items, special offers, and updates from the Cheril community
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-[#F7996E] rounded-full"
            required
          />
          <Button 
            type="submit"
            className="bg-[#F7996E] hover:bg-[#e8895f] text-white px-8 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105"
          >
            Subscribe
          </Button>
        </form>

        <p className="text-sm text-white/60 mt-4">
          No spam, just updates on awesome rental opportunities!
        </p>
      </div>
    </section>
  );
};

export default NewsletterSignup;
