
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
import BannerAd from '@/components/ads/BannerAd';
import ResponsiveAd from '@/components/ads/ResponsiveAd';

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

      {/* Author Section */}
      <section className="relative py-16 px-6 bg-gradient-to-r from-[#f8f9fa] to-[#e8f4f8] overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ 
            backgroundImage: `radial-gradient(circle at 20% 80%, #F7996E 0%, transparent 50%), radial-gradient(circle at 80% 20%, #F7996E 0%, transparent 50%)`,
          }}></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="relative">
            <p className="text-2xl md:text-3xl font-serif italic text-gray-700 leading-relaxed mb-6 font-light">
              "This project is created by{' '}
              <span className="text-[#F7996E] font-semibold">Jaysinh Patankar</span>{' '}
              as a part of their full stack development journey and a curiosity to build. 
              Cheril will always be{' '}
              <span className="text-[#F7996E] font-semibold">free for all users</span>. 
              The purpose of this project is to democratize rental platforms and provide everyone an opportunity to{' '}
              <span className="text-[#F7996E] font-semibold">maximize their earnings</span>."
            </p>
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 text-[#F7996E] opacity-30 text-6xl font-serif">"</div>
            <div className="absolute -bottom-4 -right-4 text-[#F7996E] opacity-30 text-6xl font-serif">"</div>
          </div>
          
          <div className="flex justify-center mt-8">
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-[#F7996E] to-transparent rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Banner Ad after Author Section */}
      <BannerAd adSlot="1234567890" className="max-w-6xl" />

      {/* Featured Categories */}
      <FeaturedCategories />

      {/* Responsive Ad between sections */}
      <ResponsiveAd adSlot="2345678901" variant="gradient" className="max-w-4xl" />

      {/* How It Works */}
      <HowItWorks />

      {/* Why Choose Cheril */}
      <WhyChooseCheril />

      {/* Another Ad placement */}
      <ResponsiveAd adSlot="3456789012" variant="minimal" className="max-w-3xl" />

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
