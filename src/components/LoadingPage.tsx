import React, { useState, useEffect } from 'react';
import './LoadingPage.css';

const LoadingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [ufoPosition, setUfoPosition] = useState({ x: -100, y: 50 });

  const loadingSteps = [
    { text: 'Initializing NFT environment', color: '#4CAF50' },
    { text: 'Loading smart contracts', color: '#2196F3' },
    { text: 'Connecting to blockchain', color: '#9C27B0' },
    { text: 'Setting up Web3 components', color: '#FF9800' },
    { text: 'Preparing Arte Eterno collection', color: '#E91E63' }
  ];

  useEffect(() => {
    // Step progression effect
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 1500);

    // UFO animation effect
    const ufoInterval = setInterval(() => {
      setUfoPosition(prev => ({
        x: prev.x > window.innerWidth ? -100 : prev.x + 1.5,
        y: prev.y + Math.sin(prev.x / 60) * 0.8
      }));
    }, 20);

    return () => {
      clearInterval(interval);
      clearInterval(ufoInterval);
    };
  }, []);

  return (
    <div className="loading-container">
      <video className="robot-background" autoPlay muted loop playsInline>
        <source src="https://petgascoin.com/wp-content/uploads/2025/05/Generated-File-May-16-2025-5_08PM.mp4" type="video/mp4" />
      </video>
      <div className="floating-particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{
            '--delay': `${Math.random() * 5}s`,
            '--position': `${Math.random() * 100}%`
          } as React.CSSProperties} />
        ))}
      </div>
      <div className="aurora-bg" />
      <img
        src="https://petgascoin.com/wp-content/uploads/2025/05/ufo.png"
        alt="UFO"
        className="floating-ufo"
        style={{
          transform: `translate(${ufoPosition.x}px, ${ufoPosition.y}px)`,
        }}
      />
      <div className="loading-content">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        <div className="loading-text">
          <span>Loading Arte Eterno</span>
          <span className="dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </div>
        <div className="loading-steps">
          {loadingSteps.map((step, index) => (
            <div
              key={index}
              className={`step-text ${index <= currentStep ? 'active' : ''}`}
              style={{ color: index <= currentStep ? step.color : '#4a4a4a' }}
            >
              {index <= currentStep ? '✓ ' : ''}
              {step.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
