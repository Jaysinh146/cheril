
import React, { useEffect, useRef } from 'react';

interface BannerAdProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  className?: string;
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const BannerAd: React.FC<BannerAdProps> = ({ 
  adSlot, 
  adFormat = 'auto',
  className = '',
  style = {}
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

  return (
    <div 
      className={`ad-container my-6 mx-auto flex justify-center ${className}`}
      style={style}
    >
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg shadow-sm border border-gray-200">
        <ins
          ref={adRef}
          className="adsbygoogle block"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-2421532556513913"
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};

export default BannerAd;
