
import React, { useEffect, useRef } from 'react';

interface ResponsiveAdProps {
  adSlot: string;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'minimal' | 'bordered' | 'gradient';
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const ResponsiveAd: React.FC<ResponsiveAdProps> = ({ 
  adSlot,
  className = '',
  style = {},
  variant = 'bordered'
}) => {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (error) {
      console.log('AdSense error:', error);
    }
  }, []);

  const getWrapperStyles = () => {
    switch (variant) {
      case 'minimal':
        return 'bg-gray-50 p-3 rounded-md';
      case 'gradient':
        return 'bg-gradient-to-r from-orange-50 to-pink-50 p-4 rounded-lg shadow-sm border border-orange-100';
      default:
        return 'bg-white p-4 rounded-lg shadow-sm border border-gray-200';
    }
  };

  return (
    <div 
      className={`ad-container my-6 mx-auto max-w-full ${className}`}
      style={style}
    >
      <div className={getWrapperStyles()}>
        <div className="text-xs text-gray-400 text-center mb-2 font-medium uppercase tracking-wider">
          Advertisement
        </div>
        <ins
          ref={adRef}
          className="adsbygoogle block"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-2421532556513913"
          data-ad-slot={adSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};

export default ResponsiveAd;
