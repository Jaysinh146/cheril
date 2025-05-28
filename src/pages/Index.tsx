
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, Sparkles, Heart, Shield, TrendingUp, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import FeaturedCategories from '@/components/FeaturedCategories';
import HowItWorks from '@/components/HowItWorks';
import WhyChooseCheril from '@/components/WhyChooseCheril';
import Testimonials from '@/components/Testimonials';
import NewsletterSignup from '@/components/NewsletterSignup';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section with Gradient Background */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-r from-[#f9f9f9] to-[#ffebe3] pt-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0" style={{ 
            backgroundImage: `radial-gradient(#F7996E 2px, transparent 2px), radial-gradient(#F7996E 2px, transparent 2px)`,
            backgroundSize: `30px 30px`,
            backgroundPosition: `0 0, 15px 15px`
          }}></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Share, Find, and Rent with <span className="text-[#F7996E] block md:inline">Cheril</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 font-light text-gray-700">
            The trusted platform for renting verified items in your community. 
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/browse">
              <Button size="lg" className="bg-[#F7996E] hover:bg-[#e8895f] text-white px-8 py-4 text-lg font-medium rounded-full transition-all duration-300 hover:scale-105">
                Browse Rentals
              </Button>
            </Link>
            <Link to="/list-item">
              <Button size="lg" className="bg-white text-[#F7996E] hover:bg-gray-50 border-2 border-[#F7996E] px-8 py-4 text-lg font-medium rounded-full transition-all duration-300 hover:scale-105">
                List Your Item
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <ArrowDown className="w-6 h-6 text-white animate-bounce" />
        </div>
      </section>

      {/* Featured Categories */}
      <FeaturedCategories />

      {/* How It Works */}
      <HowItWorks />

      {/* Why Choose Cheril */}
      <WhyChooseCheril />

      {/* Testimonials */}
      <Testimonials />

      {/* Newsletter Signup */}
      <NewsletterSignup />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
