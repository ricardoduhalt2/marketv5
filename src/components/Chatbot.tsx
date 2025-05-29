import React from 'react';
import './Chatbot.css';
import { useChatbot, type Message } from '../hooks/useChatbot';

export interface ChatbotProps {
  fullPage?: boolean;
}

const Chatbot: React.FC<ChatbotProps> = ({ fullPage = false }) => {
  const {
    // Estados
    messages,
    input,
    isExpanded,
    isTyping,
    isInputDisabled,
    
    // Refs
    messagesEndRef,
    inputRef,
    messagesContainerRef,
    
    // Handlers
    handleInputChange,
    handleInputKeyPress,
    handleSendMessage,
    setIsExpanded: _setIsExpanded, // Prefijo con _ para indicar que no se usa directamente
  } = useChatbot(fullPage);

  // La lógica del chatbot ahora está en el hook useChatbot

  // La lógica de procesamiento de mensajes ahora está en el hook useChatbot

  return (
    <div className={fullPage ? 'h-full w-full flex flex-col' : `chatbot-container ${isExpanded ? 'expanded' : ''}`}>
      <div 
        ref={messagesContainerRef} 
        className={`messages-container ${fullPage ? 'flex-1 overflow-y-auto' : ''} ${!fullPage && !isExpanded ? 'hidden' : ''}`}
      >
        {messages.map((message: Message, index: number) => (
          <div 
            key={index} 
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

      <div className="chatbot-main">
        <div className="chatbot-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            className="chatbot-input"
            placeholder={fullPage ? "Escribe tu pregunta aquí..." : "Pregunta sobre nuestra colección..."}
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleInputKeyPress}
            disabled={isInputDisabled}
            aria-label="Escribe tu mensaje"
          />
          <button
            className="chatbot-send-button"
            onClick={handleSendMessage}
            disabled={!input.trim() || isInputDisabled}
            aria-label="Enviar mensaje"
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
