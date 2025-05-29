import React from 'react';
import Chatbot from '../components/Chatbot';
import BackToMarketplaceButton from '../components/BackToMarketplaceButton';
import './AiAssistant.css';

const AiAssistant: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d0c11] to-[#1a1424] flex flex-col">
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center mb-8">
          <BackToMarketplaceButton />
        </div>
        
        <div className="w-full flex-1 flex flex-col">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
            AI Assistant - Arte Eterno Collection
          </h1>
          <div className="flex-1 flex flex-col min-h-0">
            <Chatbot fullPage={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
