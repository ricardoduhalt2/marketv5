import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AiAssistantButton.css';

const AiAssistantButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/ai-assistant')}
      className="ai-assistant-button group"
      aria-label="Open AI Assistant"
    >
      <div className="button-content">
        <div className="robot-icon">
          <div className="robot-face">
            <div className="eyes">
              <div className="eye"></div>
              <div className="eye"></div>
            </div>
            <div className="antenna"></div>
          </div>
        </div>
        <span className="button-text">AI Assistant</span>
      </div>
      <div className="button-glow"></div>
    </button>
  );
};

export default AiAssistantButton;
