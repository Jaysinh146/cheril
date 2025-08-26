import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import Footer from '@/components/Footer';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
  categoryId: string;
  qIndex: number;
}

const faqs = [
    {
      category: 'Renting',
      questions: [
        {
          question: 'How do I rent an item?',
          answer: 'To rent an item, browse our listings, select the item you want, choose your rental dates, and click "Rent Now". You\'ll need to provide payment information and agree to our rental terms.'
        },
        {
          question: 'What are the rental periods?',
          answer: 'Rental periods vary by item and lender. Most items can be rented daily, weekly, or monthly. The available rental periods will be shown on each item\'s listing.'
        },
        {
          question: 'How does the security deposit work?',
          answer: 'A security deposit may be required when you rent an item. This is held as a pre-authorization on your payment method and will be released after the item is returned in good condition.'
        }
      ]
    },
    {
      category: 'Lending',
      questions: [
        {
          question: 'How do I list an item for rent?',
          answer: 'To list an item, click "List an Item" in the navigation menu, fill in the details about your item, upload photos, set your price and availability, and publish your listing.'
        },
        {
          question: 'What are the insurance options for my items?',
          answer: 'We offer protection plans that cover damage or loss of your items. You can choose the level of coverage that works best for you when listing your item.'
        },
        {
          question: 'How do I get paid?',
          answer: 'You\'ll receive payment via direct deposit to your bank account after the rental period is complete and the item has been returned in good condition.'
        }
      ]
    },
    {
      category: 'Account & Payments',
      questions: [
        {
          question: 'How do I update my payment method?',
          answer: 'Go to your profile, select "Payment Methods", and click "Add Payment Method". You can set a default payment method for future rentals.'
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit and debit cards, including Visa, Mastercard, American Express, and Discover. We also support Apple Pay and Google Pay.'
        },
        {
          question: 'How do I update my account information?',
          answer: 'You can update your account information at any time by going to your profile and selecting "Edit Profile".'
        }
      ]
    },
    {
      category: 'Safety & Trust',
      questions: [
        {
          question: 'How does Cheril verify users?',
          answer: 'We require all users to verify their identity with a phone number and email address. We also offer optional ID verification for added trust.'
        },
        {
          question: 'What should I do if there\'s an issue with my rental?',
          answer: 'Contact our support team immediately if you encounter any issues. For damage or late returns, please document the issue with photos and contact us within 24 hours.'
        },
        {
          question: 'How are disputes resolved?',
          answer: 'Our support team will mediate any disputes between renters and lenders. We may request documentation and will work to resolve issues fairly for both parties.'
        }
      ]
    }
  ];

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFaqs, setFilteredFaqs] = useState<FAQItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Flatten all FAQs for search
  const allFaqs: FAQItem[] = faqs.flatMap((category) => 
    category.questions.map((q, qIndex) => ({
      ...q,
      category: category.category,
      categoryId: category.category.toLowerCase().replace(/\s+/g, '-'),
      qIndex
    }))
  );
  
  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredFaqs([]);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    const results = allFaqs.filter(
      faq =>
        faq.question.toLowerCase().includes(query.toLowerCase()) ||
        faq.answer.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredFaqs(results);
  }, [allFaqs]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1">
        {/* Hero Section */}
        <div className="bg-[#181A2A] text-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-poppins">How can we help you?</h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto font-poppins">
              Find answers to common questions or get in touch with our support team.
            </p>
            <div className="max-w-2xl mx-auto relative">
              <Input
                type="search"
                placeholder="Search help articles..."
                className="w-full pl-12 pr-6 py-6 rounded-full bg-white/10 border-0 text-white placeholder-gray-300 focus:ring-2 focus:ring-[#F7996E]"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 w-5 h-5" />
            </div>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          {/* Popular Topics */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-gray-900 font-poppins">Popular Topics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {faqs.map((category, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 font-poppins">{category.category}</h3>
                  <ul className="space-y-3">
                    {category.questions.map((item, qIndex) => (
                      <li key={qIndex}>
                        <a 
                          href={`#${category.category.toLowerCase().replace(/\s+/g, '-')}-${qIndex}`}
                          className="text-[#F7996E] hover:underline text-sm font-poppins"
                          onClick={(e) => {
                            e.preventDefault();
                            setSearchQuery('');
                            setIsSearching(false);
                            const targetId = `#${category.category.toLowerCase().replace(/\s+/g, '-')}-${qIndex}`;
                            document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth' });
                          }}
                        >
                          {item.question}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Sections */}
          <div className="space-y-16">
            {isSearching ? (
              // Search results view
              <div>
                <h2 className="text-2xl font-bold mb-8 text-gray-900 font-poppins">
                  {filteredFaqs.length > 0 
                    ? `Search Results for "${searchQuery}"`
                    : `No results found for "${searchQuery}"`
                  }
                </h2>
                {filteredFaqs.length > 0 && (
                  <div className="space-y-6">
                    {filteredFaqs.map((faq) => (
                      <div key={`${faq.categoryId}-${faq.qIndex}`} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <Link 
                          to={`#${faq.categoryId}`} 
                          className="text-sm text-[#F7996E] font-medium mb-1 font-poppins hover:underline inline-block"
                          onClick={() => {
                            setSearchQuery('');
                            setIsSearching(false);
                          }}
                        >
                          {faq.category}
                        </Link>
                        <h3 className="text-lg font-semibold mb-2 text-gray-900 font-poppins">
                          {faq.question}
                        </h3>
                        <p className="text-gray-600 font-poppins">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Category view when not searching
              faqs.map((category, index) => (
                <div key={index} id={category.category.toLowerCase().replace(/\s+/g, '-')} className="scroll-mt-20">
                  <h2 className="text-2xl font-bold mb-8 text-gray-900 font-poppins">{category.category}</h2>
                  <div className="space-y-6">
                    {category.questions.map((item, qIndex) => (
                      <div 
                        key={qIndex} 
                        id={`${category.category.toLowerCase().replace(/\s+/g, '-')}-${qIndex}`}
                        className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                      >
                        <h3 className="text-lg font-semibold mb-2 text-gray-900 font-poppins">
                          {item.question}
                        </h3>
                        <p className="text-gray-600 font-poppins">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Contact Support */}
          <div className="mt-20 bg-[#F9FAFB] p-8 rounded-2xl text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 font-poppins">Still need help?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto font-poppins">
              Our support team is here to help you with any questions or issues you might have.
            </p>
            <a href="mailto:patankararyan7@gmail.com">
              <Button className="bg-[#F7996E] hover:bg-[#e68a60] px-8 py-6 text-base font-poppins">
                Contact Support
              </Button>
            </a>
          </div>
        </div>
      </div>
      
      {/* Footer - Full Width */}
      <div className="w-full mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default HelpCenter;
