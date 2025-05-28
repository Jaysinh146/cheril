
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ListItemSteps from '@/components/ListItemSteps';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ListItem = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-white font-poppins">
        <Header />
        
        <div className="pt-24 pb-16">
          <div className="max-w-md mx-auto px-6">
            <Card className="shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-[#181A2A]">
                  Authentication Required
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <p className="text-center text-gray-600">
                  You need to be logged in to list an item on our platform.
                </p>
                
                <div className="flex flex-col space-y-3">
                  <Button 
                    onClick={() => navigate('/auth')} 
                    className="bg-[#F7996E] hover:bg-[#e8895f] text-white"
                  >
                    Sign In / Sign Up
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/browse')}
                  >
                    Browse Items Instead
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-poppins">
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#181A2A] mb-4 font-poppins">
              List Your Verified Item
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-poppins">
              Join our trusted community of verified renters. Turn your unused items into income through our secure platform.
            </p>
          </div>
          <div className="mt-6">
            <ListItemSteps />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ListItem;
