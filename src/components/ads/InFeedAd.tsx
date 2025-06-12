
import React, { useEffect, useRef } from 'react';

interface InFeedAdProps {
  adSlot: string;
  className?: string;
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const InFeedAd: React.FC<InFeedAdProps> = ({ 
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
      className={`ad-container my-8 mx-auto ${className}`}
      style={style}
    >
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm border border-blue-100">
        <div className="text-xs text-gray-500 text-center mb-3 font-medium tracking-wide">
          SPONSORED CONTENT
        </div>
        <ins
          ref={adRef}
          className="adsbygoogle block"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-2421532556513913"
          data-ad-slot={adSlot}
          data-ad-format="fluid"
          data-ad-layout-key="-fb+5w+4e-db+86"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};

export default InFeedAd;
