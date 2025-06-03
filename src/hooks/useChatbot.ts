import React, { 
  useCallback, 
  useState, 
  useRef, 
  useEffect 
} from 'react';
import { 
  processWithAI, 
  initAIClient, 
  NftContext,
  getCollectionSummary 
} from '../services/aiService';
import { analyticsService } from '../services/analyticsService';

// Types
export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  sender: 'user' | 'bot';
}

interface UseChatbotReturn {
  messages: Message[];
  input: string;
  isExpanded: boolean;
  isTyping: boolean;
  isInputDisabled: boolean;
  error: string | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSendMessage: () => Promise<void>;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  toggleExpand: () => void;
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  handleSuggestionClick: (suggestion: string) => void;
}

const useChatbot = (): UseChatbotReturn => {
  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [aiModel, setAiModel] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Refs with proper null handling
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize AI client when component mounts
  useEffect(() => {
    const initializeAI = async () => {
      const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;
      if (!apiKey) {
        const errorMsg = 'Google AI API key not found';
        console.error(errorMsg);
        setError(errorMsg);
        return;
      }
      
      try {
        const client = initAIClient(apiKey);
        if (client) {
          const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });
          setAiModel(model);
          setError(null);
          
          // Add enhanced welcome message
          setMessages([{
            id: '1',
            text: `¡Hola! 👋 Soy tu asistente especializado en la colección **Arte Eterno** del Museo de Arte Contemporáneo de Quintana Roo.

🎨 **¿Qué puedo hacer por ti?**
• Información detallada sobre nuestras 16 piezas únicas
• Precios y rareza de los NFTs (desde 0.5 POL hasta 35,259 POL)
• Ubicaciones del museo en Playa del Carmen y Cancún
• Guía para comprar y entender la tecnología blockchain
• Recomendaciones personalizadas según tus intereses

**Destacados de la colección:**
🌟 YSL - "Yo Soy Libertad" (Legendario - 35,259 POL)
⚡ TEM - "Tides of the Eternal Mind" (Ultra Raro - 8,903 POL)  
🎯 CHIDO - Perfecto para comenzar (0.5 POL)

¿Qué te gustaría explorar primero? 🚀`,
            isUser: false,
            timestamp: new Date(),
            sender: 'bot'
          }]);
        }
      } catch (error) {
        const errorMsg = 'Failed to initialize AI service. Please refresh the page to try again.';
        console.error(errorMsg, error);
        setError(errorMsg);
      }
    };
    
    initializeAI();
  }, []);

  // Process user message with AI
  const processUserMessage = useCallback(async (message: string) => {
    const startTime = Date.now();
    let errorOccurred = false;
    let intent = 'general_inquiry';
    
    if (!aiModel) {
      errorOccurred = true;
      analyticsService.trackInteraction({
        userInput: message,
        botResponse: 'AI model not available',
        responseTime: Date.now() - startTime,
        intent,
        wasHelpful: false,
        errorOccurred
      });
      return 'I am not able to process your request right now. Please try again later.';
    }
    
    // Detect intent for analytics
    const input = message.toLowerCase();
    if (input.includes('precio') || input.includes('price')) intent = 'price_inquiry';
    else if (input.includes('museo') || input.includes('museum')) intent = 'museum_info';
    else if (input.includes('comprar') || input.includes('buy')) intent = 'purchase_info';
    else if (input.includes('colección') || input.includes('collection')) intent = 'collection_overview';
    
    // Create context for the AI with detailed collection info
    const context: NftContext = {
      collectionInfo: getCollectionSummary(),
      marketData: {
        floorPrice: '0.5',
        totalVolume: '1000',
        owners: 100
      },
      currencyRates: {
        maticToUSD: 0.5,
        usdToMXN: 20
      }
    };
    
    try {
      // Show typing indicator
      setIsTyping(true);
      
      // Process with AI (with timeout to prevent hanging)
      const response = await Promise.race([
        processWithAI(aiModel, message, context),
        new Promise<string>((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 10000)
        )
      ]);
      
      // Track successful interaction
      analyticsService.trackInteraction({
        userInput: message,
        botResponse: response as string,
        responseTime: Date.now() - startTime,
        intent,
        wasHelpful: true,
        errorOccurred: false
      });
      
      return response as string;
      
    } catch (error) {
      console.error('Error processing message with AI:', error);
      errorOccurred = true;
      
      // Provide more specific error messages with helpful suggestions
      let errorResponse = '';
      if (error instanceof Error) {
        if (error.message.includes('quota') || error.message.includes('rate limit')) {
          errorResponse = 'Estoy recibiendo muchas consultas en este momento. Mientras tanto, puedo ayudarte con:\n\n• C.H.I.D.O. cuesta solo 0.5 POL (~$0.25)\n• El museo está en Playa del Carmen y Cancún\n• Tenemos 16 piezas únicas en la colección\n\n¿Te interesa alguna de estas opciones?';
        } else if (error.message.includes('timeout')) {
          errorResponse = 'La consulta está tardando más de lo normal. Aquí tienes información rápida:\n\n🎨 **Destacados:**\n• YSL - Yo Soy Libertad (35,259 POL) - La más valiosa\n• TEM - Tides of the Eternal Mind (8,903 POL) - Ultra rara\n• CHIDO - C.H.I.D.O. (0.5 POL) - Perfecta para empezar\n\n¿Quieres saber más sobre alguna?';
        } else if (error.message.includes('network')) {
          errorResponse = 'Problemas de conexión detectados. Te puedo ayudar con información básica:\n\n📍 **Museo ubicado en:**\n• Playa del Carmen: 5ta Avenida entre Calle 14 y 16\n• Cancún: La Isla Shopping Village\n\n💡 **Tip:** Todas nuestras piezas están en blockchain Polygon para transacciones rápidas y económicas.';
        }
      }
      
      if (!errorResponse) {
        errorResponse = 'Tengo dificultades técnicas temporales. Mientras se resuelve, aquí tienes lo esencial:\n\n🌟 **Arte Eterno Collection:**\n• 16 piezas únicas de arte digital\n• Precios desde 0.5 POL hasta 35,259 POL\n• Tecnología blockchain Polygon\n• Museo en Quintana Roo\n\n¿Te gustaría que profundice en algún tema específico?';
      }
      
      // Track error interaction
      analyticsService.trackInteraction({
        userInput: message,
        botResponse: errorResponse,
        responseTime: Date.now() - startTime,
        intent,
        wasHelpful: false,
        errorOccurred
      });
      
      return errorResponse;
    } finally {
      setIsTyping(false);
    }
  }, [aiModel]);

  // Handle sending a message
  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || isTyping) return;
    
    const userMessage = input.trim();
    const messageId = Date.now().toString();
    
    // Add user message to chat
    setMessages(prev => [
      ...prev, 
      {
        id: messageId,
        text: userMessage,
        isUser: true,
        timestamp: new Date(),
        sender: 'user'
      }
    ]);
    
    // Clear input and disable while processing
    setInput('');
    setIsTyping(true);
    setIsInputDisabled(true);
    
    try {
      // Process message with AI
      const aiResponse = await processUserMessage(userMessage);
      
      // Add AI response to chat
      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          text: aiResponse,
          isUser: false,
          timestamp: new Date(),
          sender: 'bot'
        }
      ]);
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      setError('Failed to get a response. Please try again.');
    } finally {
      setIsTyping(false);
      setIsInputDisabled(false);
      
      // Focus input after processing
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [input, isTyping, processUserMessage]);

  // Handle suggestion click
  const handleSuggestionClick = useCallback((suggestion: string) => {
    setInput(suggestion);
    // Auto-send the suggestion
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  }, [handleSendMessage]);
  
  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);
  
  // Handle key press (Enter to send)
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);
  
  // Toggle chat expansion
  const toggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
    
    // Focus input when expanding
    if (!isExpanded && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isExpanded]);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Focus input when expanded changes
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      // Use type assertion to tell TypeScript we know what we're doing
      const input = inputRef.current as HTMLInputElement;
      setTimeout(() => input.focus(), 100);
    }
  }, [isExpanded]);

  return {
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
  };
};

export default useChatbot;