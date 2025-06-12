
import React from 'react';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { Card } from '@/components/ui/card';

const Analytics = () => {
  const { user } = useAuth();
  const [totalListings, setTotalListings] = useState('--');
  const [totalRentals, setTotalRentals] = useState('--');
  const [totalViews, setTotalViews] = useState('--');
  const [viewsPerProduct, setViewsPerProduct] = useState([]);
  const [viewsOverTime, setViewsOverTime] = useState([]);

  useEffect(() => {
    if (!user) return;
    const fetchAnalytics = async () => {
      // Fetch total listings
      const { count: listingsCount } = await supabase
        .from('items')
        .select('id', { count: 'exact', head: true })
        .eq('owner_id', user.id);
      setTotalListings(listingsCount?.toString() ?? '--');

      // Fetch total rentals
      const { count: rentalsCount } = await supabase
        .from('bookings')
        .select('id', { count: 'exact', head: true })
        .eq('renter_id', user.id);
      setTotalRentals(rentalsCount?.toString() ?? '--');

      // Fetch all item ids and names owned by user
      const { data: items } = await supabase
        .from('items')
        .select('id, title')
        .eq('owner_id', user.id);
      const itemIds = items?.map((item) => item.id) || [];
      const itemNames = items?.reduce((acc, item) => { acc[item.id] = item.title; return acc; }, {}) || {};
      if (itemIds.length === 0) {
        setTotalViews('0');
        return;
      }
      // Fetch total views for all user's items
      const { count: viewsCount } = await supabase
        .from('views')
        .select('id', { count: 'exact', head: true })
        .in('item_id', itemIds);
      setTotalViews(viewsCount?.toString() ?? '--');

      // Fetch views per product
      if (itemIds.length > 0) {
        const { data: viewsData } = await supabase
          .from('views')
          .select('item_id, viewed_at');
        if (viewsData) {
          // Views per product
          const productViews = {};
          viewsData.forEach((v) => {
            if (!productViews[v.item_id]) productViews[v.item_id] = 0;
            productViews[v.item_id]++;
          });
          setViewsPerProduct(
            itemIds.map((id) => ({
              name: itemNames[id] || id,
              views: productViews[id] || 0,
            }))
          );
          // Views over time (by day)
          const viewsByDay = {};
          viewsData.forEach((v) => {
            const day = v.viewed_at.slice(0, 10);
            if (!viewsByDay[day]) viewsByDay[day] = 0;
            viewsByDay[day]++;
          });
          setViewsOverTime(
            Object.entries(viewsByDay).map(([date, count]) => ({ date, views: count }))
          );
        }
      }
    };
    fetchAnalytics();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-white flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Example analytics cards */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-4xl font-bold text-[#F7996E]">{totalListings}</span>
            <span className="mt-2 text-gray-700 font-medium">Total Listings</span>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-4xl font-bold text-[#F7996E]">{totalRentals}</span>
            <span className="mt-2 text-gray-700 font-medium">Total Rentals</span>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-4xl font-bold text-[#F7996E]">{totalViews}</span>
            <span className="mt-2 text-gray-700 font-medium">Total Views</span>
          </div>
        </div>
        {/* Animated Bar Chart: Views per Product */}
        <Card className="mt-10 p-6">
          <h2 className="text-xl font-bold mb-4">Views per Product</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={viewsPerProduct}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="views" fill="#F7996E" isAnimationActive={true} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        {/* Animated Line Chart: Views Over Time */}
        <Card className="mt-10 p-6">
          <h2 className="text-xl font-bold mb-4">Views Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={viewsOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="views" stroke="#F7996E" strokeWidth={3} dot={false} isAnimationActive={true} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        {/* More analytics and charts can be added here */}
      </main>
    </div>
  );
};

export default Analytics;
