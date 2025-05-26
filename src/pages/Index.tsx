
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, Sparkles, Heart, Shield, TrendingUp, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import FeaturedCategories from '@/components/FeaturedCategories';
import HowItWorks from '@/components/HowItWorks';
import Benefits from '@/components/Benefits';
import Testimonials from '@/components/Testimonials';
import NewsletterSignup from '@/components/NewsletterSignup';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section with Spline Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Spline 3D Background */}
        <div className="absolute inset-0 z-0">
          <iframe 
            src='https://my.spline.design/particleshand-f5WQPNynz0OaKwFetUiQnMIX/' 
            frameBorder='0' 
            width='100%' 
            height='100%'
            className="w-full h-full"
          />
        </div>
        
        {/* Content Overlay */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Give life to what's 
            <span className="text-[#F7996E]"> lying idle</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 font-light">
            Find what you need in a tap.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/browse">
              <Button size="lg" className="bg-[#F7996E] hover:bg-[#e8895f] text-white px-8 py-4 text-lg font-medium rounded-full transition-all duration-300 hover:scale-105">
                Browse Rentals
              </Button>
            </Link>
            <Link to="/list-item">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#181A2A] px-8 py-4 text-lg font-medium rounded-full transition-all duration-300 hover:scale-105">
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

      {/* Benefits */}
      <Benefits />

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
