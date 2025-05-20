import React, { useState, useEffect, useRef } from 'react';
import { nftData } from '../data/nftData';
import './Chatbot.css';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<null | HTMLDivElement>(null);

  // Configuración de Google AI
  const API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY;
  const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;
  const model = genAI?.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container && isExpanded) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isExpanded]);

  // Close messages panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const container = document.querySelector('.chatbot-container');
      if (container && !container.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatPrice = (price: string | undefined, symbol: string | undefined) => {
    if (!price || !symbol) return 'Precio no disponible';
    return `${Number(price).toLocaleString()} ${symbol}`;
  };

  const getCollectionContext = () => {
    return nftData.map(nft => `
      Nombre: ${nft.name}
      Descripción: ${nft.description || 'No disponible'}
      Precio: ${formatPrice(nft.price, nft.currencySymbol)}
      ID: ${nft.id}
      Contrato: ${nft.editionContractAddress}
    `).join('\n\n');
  };

  const processWithAI = async (userInput: string, contextualInfo: string) => {
    if (!model) {
      return "Lo siento, no puedo procesar tu pregunta en este momento. ¿Te gustaría ver la información básica de nuestra colección?";
    }

    try {
      const prompt = `
      Eres un asistente especializado en NFTs del Museo de Arte Contemporáneo de Quintana Roo.
      Aquí está la información de nuestra colección:
      ${contextualInfo}

      Pregunta del usuario: ${userInput}

      Por favor, responde de manera concisa y específica, usando solo la información proporcionada.
      Si no tienes la información exacta, indícalo claramente.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return text || "No pude generar una respuesta. ¿Te gustaría ver la información básica de nuestra colección?";
    } catch (error) {
      console.error('Error al procesar con AI:', error);
      return "Hubo un error al procesar tu pregunta. ¿Te gustaría ver la información básica de nuestra colección?";
    }
  };

  const processUserMessage = async (userInput: string) => {
    try {
      const lowerInput = userInput.toLowerCase().trim();
      
      // Respuesta a "cómo te llamas"
      if (lowerInput.includes('como te llamas') || lowerInput.includes('quien eres')) {
        return "Soy GitHub Copilot, el asistente de MACQ. Estoy aquí para ayudarte con información sobre nuestra colección de NFTs.";
      }

      // Si pregunta por la colección completa
      if (lowerInput.includes('colección') || 
          lowerInput.includes('nfts') || 
          lowerInput === 'si' || 
          lowerInput === 'sí') {
        const info = `Aquí está la información completa de nuestra colección:\n\n${getCollectionContext()}`;
        return info;
      }

      // Procesar con AI para otras preguntas
      return processWithAI(userInput, getCollectionContext());
    } catch (error) {
      console.error('Error al procesar mensaje:', error);
      return "Lo siento, hubo un error al procesar tu mensaje. ¿Te gustaría ver la información básica de nuestra colección?";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim() && !isInputDisabled) {
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isInputDisabled) return;

    setIsInputDisabled(true);
    setIsExpanded(true);
    
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    
    setIsTyping(true);
    const response = await processUserMessage(userMessage);
    setIsTyping(false);
    
    setMessages(prev => [...prev, { text: response, sender: 'bot' }]);
    setIsInputDisabled(false);
  };

  return (
    <div className={`chatbot-container ${isExpanded ? 'expanded' : ''}`}>
      <div className="chatbot-main">
        <div className="chatbot-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            className="chatbot-input"
            placeholder="Pregunta sobre nuestra colección..."
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleInputKeyPress}
            disabled={isInputDisabled}
          />
          <button
            className="chatbot-send-button"
            onClick={handleSendMessage}
            disabled={!input.trim() || isInputDisabled}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>

      <div className="chatbot-messages-panel">
        <div ref={messagesContainerRef} className="messages-container">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              <div className="message-content">{message.text}</div>
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
      </div>
    </div>
  );
};

export default Chatbot;
