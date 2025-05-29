import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { nftData } from '../data/nftData';
import './Chatbot.css';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Función para obtener el precio de MATIC en USD desde CoinGecko
const fetchMaticPrice = async (): Promise<number> => {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd&precision=4'
    );
    const data = await response.json();
    return data['matic-network']?.usd || 0.7; // Valor por defecto en caso de error
  } catch (error) {
    console.error('Error fetching MATIC price:', error);
    return 0.7; // Valor por defecto en caso de error
  }
};

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

interface ChatbotProps {
  fullPage?: boolean;
}

const Chatbot: React.FC<ChatbotProps> = ({ fullPage = false }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(fullPage);
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

  // Only add click outside listener if not in fullPage mode
  useEffect(() => {
    if (!fullPage) {
      const handleClickOutside = (event: MouseEvent) => {
        const container = document.querySelector('.chatbot-container');
        if (container && !container.contains(event.target as Node)) {
          setIsExpanded(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [fullPage]);

  // Focus input on mount for fullPage mode
  useEffect(() => {
    if (fullPage && inputRef.current) {
      inputRef.current.focus();
    }
  }, [fullPage]);

  // Obtener el precio de MATIC en USD
  const { data: maticPrice, isLoading, error } = useQuery({
    queryKey: ['maticPrice'],
    queryFn: fetchMaticPrice,
    staleTime: 5 * 60 * 1000, // 5 minutos hasta que se considere obsoleto
    refetchInterval: 5 * 60 * 1000, // Actualizar cada 5 minutos
  });

  const formatPrice = (price: string | undefined, symbol: string | undefined): string => {
    if (!price || !symbol) return 'Precio no disponible';
    
    const numericPrice = Number(price);
    const usdValue = numericPrice * (maticPrice || 0.7);
    
    const formattedPolygon = `${numericPrice.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    })} ${symbol}`;
    
    const formattedUsd = usdValue.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    const lastUpdated = new Date().toLocaleTimeString();
    
    // Mostrar estado de carga si aún no tenemos el precio
    if (isLoading) {
      return `${numericPrice.toLocaleString()} ${symbol}\n(Cargando conversión a USD...)`;
    }
    
    // Mostrar error si hay un problema con la API
    if (error) {
      return `${numericPrice.toLocaleString()} ${symbol}\n(No se pudo cargar la conversión a USD)`;
    }
    
    // Devolver una cadena de texto formateada
    return `Precio: ${formattedPolygon}\n` +
           `En USD: ~ ${formattedUsd}\n` +
           `(Última actualización: ${lastUpdated})`;
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

  // Obtener lista de nombres de NFTs disponibles para sugerencias
  const getAvailableNftNames = (): string[] => {
    return nftData.map(nft => nft.name);
  };

  // Función para encontrar el NFT más similar al texto proporcionado
  const findClosestNft = (query: string): string | null => {
    const names = getAvailableNftNames();
    const lowerQuery = query.toLowerCase();
    
    // Buscar coincidencias exactas primero
    const exactMatch = names.find(name => name.toLowerCase() === lowerQuery);
    if (exactMatch) return exactMatch;
    
    // Buscar coincidencias parciales
    const partialMatches = names.filter(name => 
      name.toLowerCase().includes(lowerQuery) || 
      lowerQuery.includes(name.toLowerCase())
    );
    
    return partialMatches.length > 0 ? partialMatches[0] : null;
  };

  // Función para encontrar un NFT mencionado en el texto
  const findNftInText = (text: string) => {
    if (!text) return null;
    
    // Buscar IDs de NFT (3-5 letras mayúsculas seguidas de dos puntos o espacio)
    const idMatch = text.match(/\b([A-Z]{3,5}):?\b/);
    if (idMatch) {
      const nftId = idMatch[1];
      const nft = nftData.find(n => n.id === nftId);
      if (nft) return nft;
    }
    
    // Buscar por nombre en comillas
    const nameMatch = text.match(/["“]([^"]+?)["”](?::|$)/) || text.match(/([A-Za-z0-9][A-Za-z0-9\s:]+?)(?:\s*:|$)/);
    if (nameMatch) {
      let nftName = nameMatch[1].trim();
      // Si el nombre termina con dos puntos, quitarlos
      if (nftName.endsWith(':')) {
        nftName = nftName.slice(0, -1).trim();
      }
      
      // Buscar coincidencia exacta primero
      const exactMatch = nftData.find(n => n.name.toLowerCase() === nftName.toLowerCase());
      if (exactMatch) return exactMatch;
      
      // Si no hay coincidencia exacta, buscar coincidencia parcial
      const partialMatch = nftData.find(n => 
        n.name.toLowerCase().includes(nftName.toLowerCase()) ||
        nftName.toLowerCase().includes(nftName.toLowerCase())
      );
      if (partialMatch) return partialMatch;
    }
    
    // Buscar por nombre sin comillas (solo si no es una palabra común)
    const commonWords = ['el', 'la', 'los', 'las', 'de', 'del', 'y', 'en', 'a', 'the', 'and', 'of', 'in', 'on', 'at', 'what', 'price', 'precio', 'costo', 'cuesta'];
    const words = text.split(/[\s:]+/).filter(word => 
      word.length > 2 && 
      !commonWords.includes(word.toLowerCase()) &&
      !/^[0-9.,]+$/.test(word) // Ignorar números solos
    );
    
    // Buscar coincidencia exacta primero
    for (const nft of nftData) {
      // Buscar coincidencia exacta del nombre completo (ignorando mayúsculas y dos puntos)
      const cleanNftName = nft.name.replace(/:/g, '').toLowerCase();
      const cleanText = text.replace(/:/g, '').toLowerCase();
      
      if (cleanText.includes(cleanNftName)) {
        return nft;
      }
      
      // Si el nombre del NFT tiene dos partes (antes y después de los dos puntos)
      const nameParts = nft.name.split(':').map(part => part.trim().toLowerCase());
      if (nameParts.length > 1) {
        // Buscar coincidencia con cualquiera de las partes
        if (nameParts.some(part => part && cleanText.includes(part))) {
          return nft;
        }
      }
    }
    
    // Si no hay coincidencia exacta, intentar con coincidencia de palabras clave
    for (const nft of nftData) {
      const nftNameWords = nft.name.toLowerCase()
        .split(/[\s:]+/)
        .filter(word => word.length > 2 && !commonWords.includes(word));
      
      const matchCount = nftNameWords.filter(word => 
        words.some(w => w.toLowerCase() === word.toLowerCase())
      ).length;
      
      // Si al menos una palabra coincide y es más del 50% de las palabras del nombre
      if (matchCount > 0 && matchCount >= Math.max(1, Math.ceil(nftNameWords.length / 2))) {
        return nft;
      }
    }
    
    return null;
  };

  // Función para obtener información detallada de un NFT
  const getNftInfo = (nft: typeof nftData[0]) => {
    const priceDisplay = formatPrice(nft.price, nft.currencySymbol);
    return `Información sobre ${nft.name} (${nft.id}):\n` +
           `Descripción: ${nft.description || 'No disponible'}\n` +
           `Precio: ${priceDisplay}\n` +
           `Contrato: ${nft.editionContractAddress || 'No disponible'}`;
  };

  const processUserMessage = async (userInput: string) => {
    try {
      const lowerInput = userInput.toLowerCase().trim();
      
      // Respuesta a "cómo te llamas"
      if (lowerInput.includes('como te llamas') || lowerInput.includes('quien eres') || 
          lowerInput.includes('what\'s your name') || lowerInput.includes('who are you')) {
        return "Soy el asistente de MACQ. Estoy aquí para ayudarte con información sobre nuestra colección de NFTs.";
      }

      // Si pregunta por la colección completa
      if (lowerInput.includes('colección') || 
          lowerInput.includes('nfts') || 
          lowerInput === 'si' || 
          lowerInput === 'sí') {
        const info = `Aquí está la información completa de nuestra colección:\n\n${getCollectionContext()}`;
        return info;
      }

      // Manejar consultas de información general sobre NFTs
      const infoKeywords = [
        // Español
        'información', 'info', 'saber', 'conoce', 'dime', 'cuéntame', 'hablame', 
        'qué es', 'que es', 'dame', 'muestrame', 'muéstrame', 'hablame',
        // Inglés
        'information', 'info', 'tell me', 'show me', 'what is', 'what are', 'give me', 'show', 'tell'
      ];
      const isInfoQuery = infoKeywords.some(keyword => lowerInput.includes(keyword));
      
      // Buscar si el usuario está preguntando por un NFT específico
      let nftQuery = '';
      let mentionedNft = findNftInText(userInput);
      
      // Si no se mencionó un NFT en este mensaje, revisar el contexto de la conversación
      if (!mentionedNft && messages.length > 0) {
        // Buscar en los últimos 4 mensajes (2 intercambios)
        const recentMessages = [...messages].reverse().slice(0, 4);
        for (const msg of recentMessages) {
          if (msg.sender === 'bot') {
            const nftInMessage = findNftInText(msg.text);
            if (nftInMessage) {
              mentionedNft = nftInMessage;
              break;
            }
          }
        }
      }
      
      // Si encontramos un NFT mencionado recientemente, usarlo
      if (mentionedNft) {
        nftQuery = mentionedNft.id;
      } else {
        // Si no, intentar encontrar por ID o nombre en el mensaje actual
        const nftIds = nftData.map(nft => nft.id.toLowerCase());
        const foundId = nftIds.find(id => lowerInput.includes(id.toLowerCase()));
        
        if (foundId) {
          nftQuery = foundId;
        } else {
          // Si no se encontró un ID, buscar por nombre
          const query = userInput.replace(new RegExp([...infoKeywords, 'precio', 'price', 'cuesta', 'costo', 'cost', 'value', 'cuanto'].join('|'), 'gi'), '').trim();
          const closestNft = findClosestNft(query);
          if (closestNft) {
            nftQuery = closestNft;
          }
        }
      }
      
      // Si encontramos un NFT, mostrar su información
      if (nftQuery) {
        const nft = nftData.find(n => 
          n.id.toLowerCase() === nftQuery.toLowerCase() || 
          n.name.toLowerCase() === nftQuery.toLowerCase()
        );
        
        if (nft) {
          // Si la pregunta es específicamente sobre el precio
          const priceKeywords = ['precio', 'price', 'cuesta', 'costo', 'cost', 'value', 'cuanto', 'cuánto'];
          const isPriceQuery = priceKeywords.some(keyword => lowerInput.includes(keyword));
          
          if (isPriceQuery) {
            const priceDisplay = formatPrice(nft.price, nft.currencySymbol);
            return `El precio de ${nft.name} (${nft.id}) es:\n${priceDisplay}`;
          }
          
          // Si es una pregunta general, mostrar toda la información
          return getNftInfo(nft);
        }
      }
      
      // Manejar consultas de precios
      const priceKeywords = ['precio', 'price', 'cuesta', 'costo', 'cost', 'value', 'cuanto'];
      const isPriceQuery = priceKeywords.some(keyword => lowerInput.includes(keyword));
      
      if (isPriceQuery) {
        // Si ya encontramos un NFT, mostrar su precio
        if (nftQuery) {
          const nft = nftData.find(n => 
            n.id.toLowerCase() === nftQuery.toLowerCase() || 
            n.name.toLowerCase() === nftQuery.toLowerCase()
          );
          
          if (nft) {
            const priceDisplay = formatPrice(nft.price, nft.currencySymbol);
            return `El precio de ${nft.name} (${nft.id}) es:\n${priceDisplay}`;
          }
        }
        
        // Si no se encontró coincidencia, mostrar sugerencias
        const availableNfts = getAvailableNftNames().join(', ');
        return `No encontré un NFT que coincida con tu búsqueda.\n\n` +
               `Estos son los NFTs disponibles: ${availableNfts}.\n` +
               `Puedes preguntar por el precio o información usando el nombre o el ID del NFT.`;
      }
      
      // Si es una consulta de información pero no se encontró un NFT específico
      if (isInfoQuery) {
        const availableNfts = getAvailableNftNames().join(', ');
        return `No encontré un NFT que coincida con tu búsqueda.\n\n` +
               `Estos son los NFTs disponibles: ${availableNfts}.\n` +
               `Puedes preguntar por más información usando el nombre o el ID del NFT.`;
      }

      // Procesar con AI para otras preguntas, incluyendo el contexto de la conversación
      const conversationContext = messages
        .slice(-4) // Tomar los últimos 4 mensajes (2 intercambios)
        .map(msg => `${msg.sender === 'user' ? 'Usuario' : 'Asistente'}: ${msg.text}`)
        .join('\n');
        
      return processWithAI(
        userInput, 
        `${getCollectionContext()}\n\nContexto de la conversación:\n${conversationContext}`
      );
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
    if (!fullPage) setIsExpanded(true);
    
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
    <div className={`${fullPage ? 'h-full w-full flex flex-col' : `chatbot-container ${isExpanded ? 'expanded' : ''}`}`}>
      <div ref={messagesContainerRef} className={`messages-container ${fullPage ? 'flex-1 overflow-y-auto' : ''} ${!fullPage && !isExpanded ? 'hidden' : ''}`}>
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender} ${fullPage ? 'max-w-4xl mx-auto w-full' : ''}`}>
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
    </div>
  );
};

export default Chatbot;
