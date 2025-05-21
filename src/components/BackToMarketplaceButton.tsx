import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BackToMarketplaceButton.css';

const BackToMarketplaceButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/')}
      className="back-marketplace-button group"
      aria-label="Back to Marketplace"
    >
      <div className="button-content">
        <div className="back-icon">
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 19l-7-7m0 0l7-7m-7 7h18" 
            />
          </svg>
        </div>
        <span className="button-text">Back to Marketplace</span>
      </div>
      <div className="button-glow"></div>
    </button>
  );
};

export default BackToMarketplaceButton;
