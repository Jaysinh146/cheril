
import React, { useEffect, useRef } from 'react';

interface RectangleAdProps {
  adSlot: string;
  className?: string;
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const RectangleAd: React.FC<RectangleAdProps> = ({ 
  adSlot,
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
      className={`ad-container my-4 flex justify-center ${className}`}
      style={style}
    >
      <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 max-w-sm">
        <div className="text-xs text-gray-400 text-center mb-2 font-medium">Advertisement</div>
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '300px', height: '250px' }}
          data-ad-client="ca-pub-2421532556513913"
          data-ad-slot={adSlot}
          data-ad-format="rectangle"
        />
      </div>
    </div>
  );
};

export default RectangleAd;
