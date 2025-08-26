import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-12 px-6 bg-[#181A2A] text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 font-poppins">CHERIL</h3>
            <p className="text-white/80 mb-4 max-w-md font-poppins">
              Verified rentals only. Rent What You Need. Earn From What You Don't.
            </p>
            <p className="text-white/60 text-sm font-poppins">
              Making fashion and lifestyle accessible to everyone while promoting sustainable living through trusted community rentals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 font-poppins">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/browse" className="text-white/80 hover:text-[#F7996E] transition-colors font-poppins">Browse</Link></li>
              <li><Link to="/list-item" className="text-white/80 hover:text-[#F7996E] transition-colors font-poppins">List Item</Link></li>
              <li><Link to="/how-it-works" className="text-white/80 hover:text-[#F7996E] transition-colors font-poppins">How It Works</Link></li>
              <li><Link to="/auth" className="text-white/80 hover:text-[#F7996E] transition-colors font-poppins">Sign In</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4 font-poppins">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/help-center" className="text-white/80 hover:text-[#F7996E] transition-colors font-poppins">Help Center</Link></li>
              <li><Link to="/privacy-policy" className="text-white/80 hover:text-[#F7996E] transition-colors font-poppins">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-white/80 hover:text-[#F7996E] transition-colors font-poppins">Terms of Service</Link></li>
              <li><a href="mailto:support@cheril.com" className="text-white/80 hover:text-[#F7996E] transition-colors font-poppins">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col space-y-1">
            <p className="text-white/60 text-sm font-poppins">
              © 2025 Cheril. All rights reserved.
            </p>
            <p className="text-white/60 text-xs font-poppins">
              Created by{' '}
              <a 
                href="https://www.linkedin.com/in/jaysinh-patankar-b6a648253/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#F7996E] hover:underline"
              >
                Jaysinh Patankar
              </a>
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end space-y-3">
            <p className="text-white/60 text-sm font-poppins">Follow me on:</p>
            <div className="flex space-x-6">
              <a href="https://x.com/jaysinh146" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#F7996E] transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="https://www.instagram.com/aryanpatankar146/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#F7996E] transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2c2.2 0 2.467.01 3.335.048.826.038 1.269.175 1.566.292.394.152.675.336.97.63.295.295.478.576.63.97.117.297.254.74.292 1.566.038.868.048 1.135.048 3.335s-.01 2.467-.048 3.335c-.038.826-.175 1.269-.292 1.566a2.612 2.612 0 01-.63.97c-.295.295-.576.478-.97.63-.297.117-.74.254-1.566.292-.868.038-1.135.048-3.335.048s-2.467-.01-3.335-.048c-.826-.038-1.269-.175-1.566-.292a2.612 2.612 0 01-.97-.63 2.612 2.612 0 01-.63-.97c-.117-.297-.254-.74-.292-1.566C2.01 12.467 2 12.2 2 10s.01-2.467.048-3.335c.038-.826.175-1.269.292-1.566.152-.394.336-.675.63-.97.295-.295.576-.478.97-.63.297-.117.74-.254 1.566-.292C7.533 2.01 7.8 2 10 2zm0-2C7.556 0 7.249.01 6.289.048 5.332.087 4.677.222 4.105.42A4.612 4.612 0 002.46 2.46 4.612 4.612 0 00.42 4.105C.222 4.677.087 5.332.048 6.29.01 7.249 0 7.556 0 10s.01 2.751.048 3.71c.039.958.174 1.613.372 2.185a4.612 4.612 0 002.04 2.04c.572.198 1.227.333 2.185.372.959.038 1.266.048 3.71.048s2.751-.01 3.71-.048c.958-.039 1.613-.174 2.185-.372a4.612 4.612 0 002.04-2.04c.198-.572.333-1.227.372-2.185.038-.959.048-1.266.048-3.71s-.01-2.751-.048-3.71c-.039-.958-.174-1.613-.372-2.185A4.612 4.612 0 0017.54 2.46 4.612 4.612 0 0015.895.42C15.323.222 14.668.087 13.71.048 12.751.01 12.444 0 10 0z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M10 4.865A5.135 5.135 0 104.865 10 5.135 5.135 0 0010 4.865zm0 8.468A3.333 3.333 0 1113.333 10 3.333 3.333 0 0110 13.333z" clipRule="evenodd" />
                  <circle cx="15.338" cy="4.662" r="1.2" />
                </svg>
              </a>
              <a href="https://www.youtube.com/@jaysinh146" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#F7996E] transition-colors">
                <span className="sr-only">YouTube</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM9.555 7.168A1 1 0 008 8.108v3.784a1 1 0 001.555.832l3.101-1.892a1 1 0 000-1.664L9.555 7.168z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
