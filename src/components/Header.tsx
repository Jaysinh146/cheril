
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/browse" className="text-2xl font-bold font-poppins">
            <span className="text-[#181A2A]">CHERIL</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/browse" 
              className="font-medium font-poppins text-[#181A2A] hover:text-[#F7996E] transition-colors duration-300"
            >
              Browse
            </Link>
            <Link 
              to="/list-item" 
              className="font-medium font-poppins text-[#181A2A] hover:text-[#F7996E] transition-colors duration-300"
            >
              List Item
            </Link>
            <Link 
              to="/how-it-works" 
              className="font-medium font-poppins text-[#181A2A] hover:text-[#F7996E] transition-colors duration-300"
            >
              How It Works
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/auth">
              <Button 
                variant="ghost" 
                className="font-poppins text-[#181A2A] hover:text-[#F7996E] font-medium"
              >
                Sign In
              </Button>
            </Link>
            <Link to="/list-item">
              <Button className="bg-[#F7996E] hover:bg-[#e8895f] text-white px-6 py-2 rounded-full font-medium font-poppins transition-all duration-300 hover:scale-105">
                List Your Item
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#181A2A]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4 mt-4">
              <Link 
                to="/browse" 
                className="font-medium font-poppins text-[#181A2A] hover:text-[#F7996E] transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Browse
              </Link>
              <Link 
                to="/list-item" 
                className="font-medium font-poppins text-[#181A2A] hover:text-[#F7996E] transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                List Item
              </Link>
              <Link 
                to="/how-it-works" 
                className="font-medium font-poppins text-[#181A2A] hover:text-[#F7996E] transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <div className="flex flex-col space-y-2 pt-4">
                <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button 
                    variant="ghost" 
                    className="w-full font-poppins text-[#181A2A] hover:text-[#F7996E] font-medium"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/list-item" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-[#F7996E] hover:bg-[#e8895f] text-white rounded-full font-medium font-poppins">
                    List Your Item
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
