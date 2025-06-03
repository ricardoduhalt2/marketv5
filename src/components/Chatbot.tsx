import React from 'react';
import './Chatbot.css';
import useChatbot from '../hooks/useChatbot';
import ChatSuggestions from './ChatSuggestions';

export interface ChatbotProps {
  fullPage?: boolean;
}

const Chatbot: React.FC<ChatbotProps> = ({ fullPage = false }) => {
  const {
    messages,
    input,
    isExpanded,
    isTyping,
    isInputDisabled,
    error,
    handleInputChange,
    handleSendMessage,
    handleKeyPress,
    toggleExpand,
    inputRef,
    messagesEndRef,
    handleSuggestionClick
  } = useChatbot();

  // Render error message if there's an error
  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <div className={fullPage ? 'h-full w-full flex flex-col' : `chatbot-container ${isExpanded ? 'expanded' : ''}`}>
      {!fullPage && (
        <div 
          className="chatbot-header"
          onClick={toggleExpand}
        >
          <h3>Arte Eterno Assistant</h3>
          <button className="toggle-button">
            {isExpanded ? '−' : '+'}
          </button>
        </div>
      )}
      
      <div 
        className={`messages-container ${fullPage ? 'flex-1 overflow-y-auto' : ''} ${!fullPage && !isExpanded ? 'hidden' : ''}`}
      >
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message ${message.sender} ${fullPage ? 'max-w-4xl mx-auto w-full' : ''}`}
          >
            <div className="message-content">
              {message.text.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < message.text.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="typing-indicator">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Add suggestions when chat is expanded or in full page mode */}
      {(isExpanded || fullPage) && messages.length > 0 && (
        <ChatSuggestions
          onSuggestionClick={handleSuggestionClick}
          messageHistory={messages.map(m => m.text)}
          currentInput={input}
          showQuickActions={messages.length <= 1}
        />
      )}

      <div className="chatbot-main">
        <div className="chatbot-input-wrapper">
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            className="chatbot-input"
            placeholder="Type your message..."
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={isInputDisabled}
            aria-label="Type your message"
          />
          <button
            className="chatbot-send-button"
            onClick={handleSendMessage}
            disabled={!input.trim() || isInputDisabled}
            aria-label="Send message"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
