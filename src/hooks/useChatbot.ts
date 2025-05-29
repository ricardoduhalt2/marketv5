import { useState, useCallback, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { findNftInText, getNftInfo, getCollectionContext } from '../services/nftService';
import { processWithAI, initAIClient } from '../services/aiService';

export interface Message {
  text: string;
  sender: 'user' | 'bot';
}

// Función para obtener el precio de MATIC en USD desde CoinGecko
const fetchMaticPrice = async (): Promise<number> => {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd&precision=4'
    );
    const data = await response.json();
    return data['matic-network']?.usd || 0.7;
  } catch (error) {
    console.error('Error fetching MATIC price:', error);
    return 0.7;
  }
};

export const useChatbot = (fullPage: boolean = false) => {
  // Estados
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
  const [genAI] = useState(() => initAIClient(API_KEY));
  const model = genAI?.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

  // Obtener el precio de MATIC en USD
  const { data: maticPrice } = useQuery({
    queryKey: ['maticPrice'],
    queryFn: fetchMaticPrice,
    staleTime: 5 * 60 * 1000, // 5 minutos hasta que se considere obsoleto
    refetchInterval: 5 * 60 * 1000, // Actualizar cada 5 minutos
  });

  // Formatear precio (función interna)
  const formatPrice = useCallback((price: string, symbol: string): string => {
    if (!price || !symbol) return 'Precio no disponible';
    
    const numericPrice = Number(price);
    const usdValue = numericPrice * (maticPrice || 0.7);
    
    const formattedPrice = numericPrice.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    });
    
    const formattedUsd = usdValue.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    return `${formattedPrice} ${symbol} (~${formattedUsd})`;
  }, [maticPrice]);
  
  // Función segura para formatear precios
  const safeFormatPrice = useCallback((price: string | undefined, symbol: string | undefined): string => {
    if (!price || !symbol) return 'Precio no disponible';
    return formatPrice(price, symbol);
  }, [formatPrice]);

  // Procesar el mensaje del usuario
  const processUserMessage = useCallback(async (userInput: string): Promise<string> => {
    const lowerInput = userInput.toLowerCase().trim();
    
    // Manejar saludos
    if (lowerInput.includes('hola') || 
        lowerInput.includes('buenos') || 
        lowerInput.includes('buenas') ||
        lowerInput.includes('hi') || 
        lowerInput.includes('hello') ||
        lowerInput.includes('hey') ||
        lowerInput.includes('what\'s your name') || 
        lowerInput.includes('who are you')) {
      return "Soy el asistente de MACQ. Estoy aquí para ayudarte con información sobre nuestra colección de NFTs.";
    }
    
    // Manejar preguntas sobre la ubicación del museo
    if (lowerInput.includes('dónde está') || 
        lowerInput.includes('donde esta') || 
        lowerInput.includes('ubicación') ||
        lowerInput.includes('ubicacion') ||
        lowerInput.includes('dirección') ||
        lowerInput.includes('direccion') ||
        lowerInput.includes('dirección del museo') ||
        lowerInput.includes('direccion del museo') ||
        lowerInput.includes('location') ||
        lowerInput.includes('mapa') ||
        lowerInput.includes('cómo llegar') ||
        lowerInput.includes('como llegar') ||
        lowerInput.includes('playa del carmen') ||
        lowerInput.includes('cancun') ||
        lowerInput.includes('la isla')) {
      
      // Si la consulta menciona específicamente Cancún o La Isla
      if (lowerInput.includes('cancun') || lowerInput.includes('la isla')) {
        return "📍 Sucursal en Cancún - La Isla Shopping Village\n" +
               "Blvd. Kukulcan Km 12.5, La Isla, Zona Hotelera\n" +
               "77500 Cancún, Quintana Roo, México\n\n" +
               "🔗 Ver en Google Maps: https://goo.gl/maps/LaIslaShoppingVillage\n\n" +
               "📅 Horario:\n" +
               "- Lunes a domingo: 10:00 AM - 10:00 PM\n\n" +
               "📞 Contacto: +52 998 123 4567\n" +
               "📧 Correo: cancun@macq.mx\n\n" +
               "¡Ven a visitarnos en el corazón de la Zona Hotelera de Cancún!";
      }
      
      // Ubicación principal en Playa del Carmen
      return "📍 Sede Principal - Playa del Carmen\n" +
             "Avenida Héroes s/n, Esquina con Calle 8 Norte\n" +
             "Centro, 77710 Playa del Carmen, Quintana Roo, México\n\n" +
             "🔗 Ver en Google Maps: https://www.google.com/maps/place/MUSEO+DE+ARTE+CONTEMPORANEO+DE+QUINTANA+ROO/@21.1127019,-86.7621038,16z\n\n" +
             "📅 Horario:\n" +
             "- Martes a domingo: 10:00 AM - 7:00 PM\n" +
             "- Lunes: Cerrado\n\n" +
             "📞 Contacto: +52 984 147 4848\n" +
             "📧 Correo: info@macq.mx\n\n" +
             "También puedes visitarnos en nuestra sucursal de Cancún. Pregunta por 'MACQ Cancún' para más información.\n\n" +
             "¡Te esperamos en el corazón de la Riviera Maya!";
    }
    
    // Manejar preguntas sobre horarios
    if (lowerInput.includes('horario') || 
        lowerInput.includes('hora') || 
        lowerInput.includes('abierto') ||
        lowerInput.includes('abren') ||
        lowerInput.includes('cierra') ||
        lowerInput.includes('horas')) {
      return "El horario del MACQ es el siguiente:\n\n" +
             "- Martes a domingo: 10:00 AM a 7:00 PM\n" +
             "- Lunes: Cerrado\n\n" +
             "Los días festivos puede haber cambios en el horario.";
    }
    
    // Manejar preguntas sobre precios de entrada
    if ((lowerInput.includes('cuánto cuesta') || 
         lowerInput.includes('cuanto cuesta') ||
         lowerInput.includes('precio de entrada') ||
         lowerInput.includes('cuesta entrar')) && 
        (lowerInput.includes('museo') || lowerInput.includes('entrada'))) {
      return "Los precios de entrada al MACQ son los siguientes:\n\n" +
             "- Entrada general: $100 MXN\n" +
             "- Estudiantes y maestros con credencial vigente: $50 MXN\n" +
             "- Adultos mayores y niños menores de 12 años: Entrada libre\n" +
             "- Domingos: Entrada libre para público nacional\n\n" +
             "*Precios sujetos a cambio sin previo aviso.";
    }

    // Si pregunta por la colección completa
    if (lowerInput.includes('colección') || 
        lowerInput.includes('nfts') || 
        lowerInput === 'si' || 
        lowerInput === 'sí') {
      return `Aquí está la información completa de nuestra colección:\n\n${getCollectionContext()}`;
    }

    // Manejar consultas de información general sobre NFTs
    const infoKeywords = [
      'información', 'info', 'saber', 'conoce', 'dime', 'cuéntame', 'hablame', 
      'qué es', 'que es', 'dame', 'muestrame', 'muéstrame', 'hablame',
      'information', 'info', 'tell me', 'show me', 'what is', 'what are', 'give me', 'show', 'tell'
    ];
    
    const isInfoQuery = infoKeywords.some(keyword => lowerInput.includes(keyword));
    
    // Buscar si el usuario está preguntando por un NFT específico
    let mentionedNft = findNftInText(userInput);
    
    // Si no se mencionó un NFT en este mensaje, revisar el contexto de la conversación
    if (!mentionedNft && messages.length > 0) {
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
    
    // Si encontramos un NFT mencionado, mostrar su información
    if (mentionedNft) {
      const priceKeywords = ['precio', 'price', 'cuesta', 'costo', 'cost', 'value', 'cuanto', 'cuánto'];
      const isPriceQuery = priceKeywords.some(keyword => lowerInput.includes(keyword));
      
      if (isPriceQuery) {
        const priceDisplay = safeFormatPrice(mentionedNft.price, mentionedNft.currencySymbol);
        return `El precio de ${mentionedNft.name} (${mentionedNft.id}) es: ${priceDisplay}`;
      }
      
      // Si es una pregunta general, mostrar toda la información
      return getNftInfo(mentionedNft, formatPrice);
    }
    
    // Si es una consulta de información pero no se encontró un NFT específico
    if (isInfoQuery) {
      return `No encontré un NFT que coincida con tu búsqueda.\n\n` +
             `Puedes preguntar por más información usando el nombre o el ID del NFT.`;
    }

    // Procesar con AI para otras preguntas, incluyendo el contexto de la conversación
    const conversationContext = messages
      .slice(-4) // Tomar los últimos 4 mensajes (2 intercambios)
      .map(msg => `${msg.sender === 'user' ? 'Usuario' : 'Asistente'}: ${msg.text}`)
      .join('\n');
      
    const additionalContext = `Información sobre el MACQ:
- Nombre: Museo de Arte Contemporáneo de Quintana Roo
- Ubicación: Avenida Héroes s/n, Esquina con Calle 8 Norte, Centro, 77710 Playa del Carmen, Q.R., México
- Horario: Martes a domingo de 10:00 AM a 7:00 PM
- Contacto: info@macq.mx | +52 984 147 4848

${getCollectionContext()}`;
      
    return processWithAI(
      model,
      userInput, 
      `${additionalContext}\n\nContexto de la conversación:\n${conversationContext}`
    ) || "Lo siento, no pude procesar tu pregunta en este momento. ¿Te gustaría información sobre nuestra colección de NFTs o la ubicación del museo?";
  }, [messages, formatPrice, model]);

  // Manejador de envío de mensajes
  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || isInputDisabled) return;

    setIsInputDisabled(true);
    if (!fullPage) setIsExpanded(true);
    
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    
    setIsTyping(true);
    try {
      const response = await processUserMessage(userMessage);
      setMessages(prev => [...prev, { text: response, sender: 'bot' }]);
    } catch (error) {
      console.error('Error processing message:', error);
      setMessages(prev => [...prev, { 
        text: "Lo siento, hubo un error al procesar tu mensaje. Por favor, inténtalo de nuevo.", 
        sender: 'bot' 
      }]);
    } finally {
      setIsTyping(false);
      setIsInputDisabled(false);
    }
  }, [input, isInputDisabled, fullPage, processUserMessage]);

  // Manejador de cambio en el input
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }, []);

  // Manejador de la tecla Enter
  const handleInputKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim() && !isInputDisabled) {
      handleSendMessage();
    }
  }, [input, isInputDisabled, handleSendMessage]);

  // Focus input cuando el componente se monta
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Scroll al final cuando llegan nuevos mensajes
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container && isExpanded) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isExpanded]);

  // Manejar clics fuera del chat (solo si no está en modo pantalla completa)
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

  // Focus input cuando se monta en modo pantalla completa
  useEffect(() => {
    if (fullPage && inputRef.current) {
      inputRef.current.focus();
    }
  }, [fullPage]);

  return {
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
    setIsExpanded,
  };
};
