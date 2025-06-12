
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Menu, Search, User, X, Bookmark, LogOut } from 'lucide-react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleSignOutClick = () => setShowLogoutDialog(true);
  const confirmSignOut = async () => {
    await signOut();
    navigate('/');
    setShowLogoutDialog(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 font-poppins">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-[#181A2A]">Cheril</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/browse" className="text-gray-700 hover:text-[#F7996E] font-medium transition-colors">
              Browse
            </Link>
            <Link to="/how-it-works" className="text-gray-700 hover:text-[#F7996E] font-medium transition-colors">
              How It Works
            </Link>
            <Link to="/list-item" className="text-gray-700 hover:text-[#F7996E] font-medium transition-colors">
              List Item
            </Link>
            <Link to="/wishlist" className="text-gray-700 hover:text-[#F7996E] font-medium transition-colors">
              Wishlist
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-100">
                    <Avatar className="w-8 h-8">
                      <AvatarImage 
                        src={user.user_metadata?.avatar_url} 
                        alt="Profile"
                        className="object-cover"
                      />
                      <AvatarFallback className="text-sm">
                        {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:block">{user.user_metadata?.full_name || user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/wishlist')}>
                    <Heart className="w-4 h-4 mr-2" />
                    Wishlist
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOutClick}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" className="text-gray-700 hover:text-[#F7996E]">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-[#F7996E] hover:bg-[#e8895f] text-white px-6">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-[#F7996E]"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/browse" 
                className="text-gray-700 hover:text-[#F7996E] font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Browse
              </Link>
              <Link 
                to="/how-it-works" 
                className="text-gray-700 hover:text-[#F7996E] font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link 
                to="/list-item" 
                className="text-gray-700 hover:text-[#F7996E] font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                List Item
              </Link>
              <Link 
                to="/wishlist" 
                className="text-gray-700 hover:text-[#F7996E] font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Wishlist
              </Link>
              
              <div className="pt-4 border-t border-gray-200">
                {user ? (
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage 
                        src={user.user_metadata?.avatar_url} 
                        alt="Profile"
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user.user_metadata?.full_name || user.email}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                ) : null}
                
                {user ? (
                  <div>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-left"
                      onClick={() => {
                        navigate('/profile');
                        setIsMenuOpen(false);
                      }}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-left text-red-600 hover:text-red-700"
                      onClick={() => {
                        setShowLogoutDialog(true);
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full text-gray-700 hover:text-[#F7996E]">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full bg-[#F7996E] hover:bg-[#e8895f] text-white">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign Out</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to sign out?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogoutDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmSignOut}>Sign Out</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
