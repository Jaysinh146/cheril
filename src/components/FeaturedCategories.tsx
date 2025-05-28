
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 1,
    name: 'Dresses',
    image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=300&fit=crop',
    count: '150+ items'
  },
  {
    id: 2,
    name: 'Jewellery',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop',
    count: '80+ items'
  },
  {
    id: 3,
    name: 'Footwear',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop',
    count: '120+ items'
  },
  {
    id: 4,
    name: 'Books',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
    count: '300+ items'
  },
  {
    id: 5,
    name: 'Kitchenware',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    count: '90+ items'
  },
  {
    id: 6,
    name: 'Party Props',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop',
    count: '60+ items'
  }
];

const FeaturedCategories = () => {
  return (
    <section className="py-16 px-6 bg-gradient-to-b from-white to-[#ffebe3]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[#181A2A] mb-4">
            Explore Categories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From fashion to lifestyle, find everything you need for rent
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link key={category.id} to={`/browse?category=${category.name.toLowerCase()}`}>
              <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border-0 bg-white">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-32 md:h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-semibold text-[#181A2A] mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.count}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
