import React from 'react';

const NFTBoutiqueLogo: React.FC = () => {
  return (
    <div className="relative w-20 h-20">
      {/* Animated gradient glow effect */}
      <div 
        className="absolute inset-0 rounded-lg"
        style={{
          background: 'linear-gradient(90deg, #ff6b00, #9d4edd, #4361ee, #4cc9f0, #9d4edd, #ff3c5f)',
          backgroundSize: '300% 100%',
          filter: 'blur(4px)',
          opacity: '0.8',
          zIndex: 1,
          animation: 'gradient 8s linear infinite',
        }}
      ></div>
      
      {/* Secondary glow layer for more intensity */}
      <div 
        className="absolute inset-0 rounded-lg"
        style={{
          background: 'linear-gradient(45deg, #ff6b00, #9d4edd, #4361ee, #4cc9f0)',
          backgroundSize: '200% 200%',
          filter: 'blur(8px)',
          opacity: '0.6',
          zIndex: 0,
          animation: 'gradient 6s linear infinite reverse',
        }}
      ></div>
      
      {/* Logo container */}
      <div
        className="relative z-10 w-full h-full flex items-center justify-center bg-white rounded-lg overflow-hidden"
        style={{
          filter: 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.8))',
          boxShadow: '0 0 20px rgba(255, 107, 0, 0.3), 0 0 40px rgba(157, 78, 221, 0.2)'
        }}
      >
        <img 
          src="https://petgascoin.com/wp-content/uploads/2025/05/UCA-logo-fondo-blanco-horizontal-1-scaled-e1748567694616.png"
          alt="NFT Boutique Marketplace Logo"
          className="w-full h-full object-contain p-1"
          style={{
            filter: 'drop-shadow(0 0 1px rgba(0, 0, 0, 0.1))'
          }}
        />
      </div>
      
      {/* Additional outer glow */}
      <div 
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255, 107, 0, 0.3) 0%, rgba(157, 78, 221, 0.2) 50%, transparent 70%)',
          filter: 'blur(6px)',
          opacity: '0.7',
          zIndex: -1,
          animation: 'pulse 3s ease-in-out infinite alternate',
        }}
      ></div>
    </div>
  );
};

export default NFTBoutiqueLogo;