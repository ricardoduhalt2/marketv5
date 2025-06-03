import React from 'react';

const NFTBoutiqueLogo: React.FC = () => {
  return (
    <div className="nft-boutique-logo-container">
      <div className="nft-boutique-logo-inner">
        <div className="relative w-20 h-20">
          {/* Blacklight glow effect */}
          <div 
            className="absolute inset-0 rounded-lg"
            style={{
              background: 'radial-gradient(circle, rgba(0, 168, 255, 0.2) 0%, rgba(106, 17, 203, 0.15) 50%, transparent 70%)',
              filter: 'blur(3px)',
              opacity: '0.8',
              zIndex: 1,
              animation: 'blacklightGlow 4s ease-in-out infinite',
            }}
          ></div>
          
          {/* Secondary blacklight layer */}
          <div 
            className="absolute inset-0 rounded-lg"
            style={{
              background: 'linear-gradient(45deg, rgba(0, 102, 255, 0.1), rgba(106, 17, 203, 0.1), rgba(0, 168, 255, 0.1))',
              backgroundSize: '200% 200%',
              filter: 'blur(2px)',
              opacity: '0.6',
              zIndex: 0,
              animation: 'blacklightBorder 5s linear infinite reverse',
            }}
          ></div>
          
          {/* Logo container with blacklight effect */}
          <div
            className="relative z-10 w-full h-full flex items-center justify-center bg-white rounded-lg overflow-hidden"
            style={{
              filter: 'drop-shadow(0 0 4px rgba(0, 168, 255, 0.4)) drop-shadow(0 0 8px rgba(106, 17, 203, 0.3))',
              boxShadow: `
                0 0 8px rgba(106, 17, 203, 0.4),
                0 0 16px rgba(0, 168, 255, 0.3),
                inset 0 0 8px rgba(255, 255, 255, 0.1)
              `,
              border: '1px solid rgba(0, 168, 255, 0.3)'
            }}
          >
            <img 
              src="https://petgascoin.com/wp-content/uploads/2025/05/UCA-logo-fondo-blanco-horizontal-1-scaled-e1748567694616.png"
              alt="NFT Boutique Marketplace Logo"
              className="w-full h-full object-contain p-1"
              style={{
                filter: 'drop-shadow(0 0 1px rgba(0, 0, 0, 0.1))'
              }}
              onError={(e) => {
                console.error('Error loading logo image:', e);
                // Fallback to text if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = '<span class="text-black font-bold text-sm">NFT Boutique</span>';
                }
              }}
            />
          </div>
          
          {/* Blacklight outer glow */}
          <div 
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(0, 168, 255, 0.2) 0%, rgba(106, 17, 203, 0.15) 40%, transparent 70%)',
              filter: 'blur(6px)',
              opacity: '0.7',
              zIndex: -1,
              animation: 'blacklightPulse 3s ease-in-out infinite alternate',
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default NFTBoutiqueLogo;