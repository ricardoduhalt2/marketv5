import { GoogleGenerativeAI, type GenerativeModel } from '@google/generative-ai';

/**
 * AI Service for NFT Marketplace Chatbot
 */

// Cache for storing API responses
const responseCache = new Map<string, { response: string; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache

// Rate limiting state
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second between requests

/**
 * Get a cached response if available and not expired
 */
const getCachedResponse = (key: string): string | null => {
  const cached = responseCache.get(key);
  if (!cached) return null;
  
  const now = Date.now();
  if (now - cached.timestamp > CACHE_TTL) {
    responseCache.delete(key);
    return null;
  }
  
  return cached.response;
};

/**
 * Store a response in cache
 */
const cacheResponse = (key: string, response: string): void => {
  responseCache.set(key, {
    response,
    timestamp: Date.now()
  });
};

/**
 * Rate limiting function
 */
const waitForRateLimit = async (): Promise<void> => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  lastRequestTime = Date.now();
};

/**
 * Initialize Google AI client
 */
export const initAIClient = (apiKey: string) => {
  if (!apiKey) {
    console.warn('Google AI API key not provided');
    return null;
  }
  try {
    return new GoogleGenerativeAI(apiKey);
  } catch (error) {
    console.error('Error initializing Google AI client:', error);
    return null;
  }
};

// Interface for NFT context
export interface NftContext {
  nftInfo?: string;
  collectionInfo?: string;
  marketData?: {
    floorPrice?: string;
    totalVolume?: string;
    owners?: number;
  };
  similarNfts?: Array<{
    id: string;
    name: string;
    price: string;
  }>;
  currencyRates?: {
    maticToUSD: number;
    usdToMXN: number;
  };
}

/**
 * Analyze user sentiment and interests for personalized responses
 */
const analyzeUserProfile = (userInput: string, messageHistory: string[] = []): {
  sentiment: 'positive' | 'neutral' | 'negative';
  interests: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  language: 'es' | 'en';
} => {
  const input = userInput.toLowerCase();
  const allMessages = messageHistory.join(' ').toLowerCase();
  
  // Detect language
  const spanishWords = ['precio', 'cuánto', 'dónde', 'cómo', 'qué', 'museo', 'colección'];
  const englishWords = ['price', 'how', 'where', 'what', 'museum', 'collection'];
  const spanishCount = spanishWords.filter(word => input.includes(word)).length;
  const englishCount = englishWords.filter(word => input.includes(word)).length;
  const language = spanishCount > englishCount ? 'es' : 'en';
  
  // Analyze sentiment
  const positiveWords = ['love', 'amazing', 'great', 'awesome', 'beautiful', 'increíble', 'genial', 'hermoso'];
  const negativeWords = ['expensive', 'difficult', 'confusing', 'caro', 'difícil', 'confuso'];
  
  const positiveCount = positiveWords.filter(word => input.includes(word)).length;
  const negativeCount = negativeWords.filter(word => input.includes(word)).length;
  
  let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
  if (positiveCount > negativeCount) sentiment = 'positive';
  else if (negativeCount > positiveCount) sentiment = 'negative';
  
  // Detect interests
  const interests: string[] = [];
  if (input.includes('art') || input.includes('arte')) interests.push('art');
  if (input.includes('technology') || input.includes('tecnología') || input.includes('blockchain')) interests.push('technology');
  if (input.includes('investment') || input.includes('inversión') || input.includes('price')) interests.push('investment');
  if (input.includes('culture') || input.includes('cultura') || input.includes('museum')) interests.push('culture');
  
  // Determine experience level
  let experienceLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
  const techTerms = ['blockchain', 'nft', 'polygon', 'ipfs', 'smart contract', 'wallet'];
  const techTermsUsed = techTerms.filter(term => allMessages.includes(term)).length;
  
  if (techTermsUsed > 3) experienceLevel = 'advanced';
  else if (techTermsUsed > 1) experienceLevel = 'intermediate';
  
  return { sentiment, interests, experienceLevel, language };
};

/**
 * Generate intelligent responses based on user intent
 */
const analyzeUserIntent = (userInput: string): string => {
  const input = userInput.toLowerCase();
  
  if (input.includes('precio') || input.includes('price') || input.includes('cost') || input.includes('cuánto')) {
    return 'price_inquiry';
  }
  if (input.includes('museo') || input.includes('museum') || input.includes('ubicación') || input.includes('location') || input.includes('dirección')) {
    return 'museum_info';
  }
  if (input.includes('comprar') || input.includes('buy') || input.includes('purchase') || input.includes('mint')) {
    return 'purchase_info';
  }
  if (input.includes('raro') || input.includes('rare') || input.includes('único') || input.includes('unique') || input.includes('especial')) {
    return 'rarity_info';
  }
  if (input.includes('artista') || input.includes('artist') || input.includes('creador') || input.includes('creator')) {
    return 'artist_info';
  }
  if (input.includes('blockchain') || input.includes('polygon') || input.includes('tecnología') || input.includes('technology')) {
    return 'technical_info';
  }
  if (input.includes('colección') || input.includes('collection') || input.includes('todos') || input.includes('all')) {
    return 'collection_overview';
  }
  
  return 'general_inquiry';
};

/**
 * Enhanced knowledge base for the chatbot
 */
export const getEnhancedKnowledgeBase = () => {
  return {
    collection: {
      name: "Arte Eterno Collection",
      description: "A curated selection of unique digital art NFTs on the Polygon blockchain",
      totalPieces: 16,
      blockchain: "Polygon",
      contractType: "ERC1155 Edition Drop",
      storage: "IPFS",
      museum: "Museo de Arte Contemporáneo de Quintana Roo"
    },
    nfts: [
      {
        id: "TEM",
        name: "Tides of the Eternal Mind",
        price: "8,903 POL",
        priceUSD: "~$4,451.50",
        category: "Abstract/Conceptual",
        rarity: "Ultra Rare",
        description: "A mesmerizing exploration of consciousness and eternal thoughts"
      },
      {
        id: "GCC",
        name: "Galactic Clean-Up Crew",
        price: "1,001 POL",
        priceUSD: "~$500.50",
        category: "Sci-Fi/Environmental",
        rarity: "Rare",
        description: "Environmental consciousness meets space exploration"
      },
      {
        id: "YSL",
        name: "Yo Soy Libertad",
        price: "35,259 POL",
        priceUSD: "~$17,629.50",
        category: "Political/Social",
        rarity: "Legendary",
        description: "A powerful statement on freedom and identity"
      },
      {
        id: "BBB",
        name: "Bit-Beats Bliss",
        price: "400 POL",
        priceUSD: "~$200",
        category: "Music/Animation",
        rarity: "Common",
        type: "Animated GIF",
        description: "Digital music visualization in motion"
      },
      {
        id: "CHIDO",
        name: "C.H.I.D.O.",
        price: "0.5 POL",
        priceUSD: "~$0.25",
        category: "Accessible Art",
        rarity: "Entry Level",
        description: "An accessible entry point into the collection"
      },
      {
        id: "RAI",
        name: "regenAIssance",
        price: "13,353 POL",
        priceUSD: "~$6,676.50",
        category: "AI/Technology",
        rarity: "Very Rare",
        description: "Renaissance meets artificial intelligence"
      },
      {
        id: "PSA",
        name: "Pirolisaurio: Born from the Fossil Age",
        price: "12,020 POL",
        priceUSD: "~$6,010",
        category: "Environmental/Prehistoric",
        rarity: "Very Rare",
        description: "Environmental message through prehistoric imagery"
      },
      {
        id: "EVC",
        name: "C0mMzoVeRLoAD",
        price: "3,557 POL",
        priceUSD: "~$1,778.50",
        category: "Digital/Glitch",
        rarity: "Rare",
        description: "Digital overload and modern communication"
      },
      {
        id: "TRG",
        name: "Treegeneration",
        price: "276 POL",
        priceUSD: "~$138",
        category: "Nature/Environmental",
        rarity: "Common",
        description: "Nature's regenerative power"
      }
    ],
    features: {
      blockchain: "Built on Polygon for low gas fees and fast transactions",
      storage: "Decentralized IPFS storage ensures permanent accessibility",
      utility: "Each NFT provides unique benefits and community access",
      authenticity: "Verified provenance and artist attribution",
      community: "Access to exclusive events and museum experiences"
    },
    museum: {
      name: "Museo de Arte Contemporáneo de Quintana Roo",
      locations: [
        {
          name: "Playa del Carmen",
          address: "5ta Avenida entre Calle 14 y 16, Playa del Carmen, Q.R.",
          hours: "Martes a Domingo: 10:00 AM - 8:00 PM",
          contact: "+52 984 803 4858"
        },
        {
          name: "Cancún - La Isla",
          address: "La Isla Shopping Village, Cancún, Q.R.",
          hours: "Lunes a Domingo: 10:00 AM - 10:00 PM",
          contact: "+52 998 176 8330"
        }
      ]
    }
  };
};

/**
 * Process user question about NFTs using AI with enhanced intelligence
 */
export const processWithAI = async (
  model: GenerativeModel | null,
  userInput: string,
  context: NftContext
): Promise<string> => {
  if (!model) {
    return "I'm sorry, I can't process your request right now. Please try again later.";
  }

  // Create a cache key based on the user input and context
  const cacheKey = `${userInput.toLowerCase().trim()}:${JSON.stringify(context).length}`;
  
  // Check cache first
  const cachedResponse = getCachedResponse(cacheKey);
  if (cachedResponse) {
    console.log('Serving from cache');
    return cachedResponse;
  }

  try {
    // Apply rate limiting
    await waitForRateLimit();

    // Analyze user intent and profile for better responses
    const userIntent = analyzeUserIntent(userInput);
    const userProfile = analyzeUserProfile(userInput);
    const knowledgeBase = getEnhancedKnowledgeBase();

    const prompt = `You are an expert AI assistant specialized in the Arte Eterno NFT collection from the Museo de Arte Contemporáneo de Quintana Roo. You have deep knowledge about digital art, blockchain technology, and NFT markets.

**Enhanced Knowledge Base:**
${JSON.stringify(knowledgeBase, null, 2)}

**Collection Context:**
${JSON.stringify(context, null, 2)}

**User Question:** ${userInput}
**Detected Intent:** ${userIntent}
**User Profile:** ${JSON.stringify(userProfile, null, 2)}

**Advanced Instructions for your response:**

1. **Personality & Tone:**
   - Be enthusiastic about art and technology
   - Show expertise in both traditional and digital art
   - Be culturally sensitive and respectful
   - Adapt language based on user profile (${userProfile.language === 'es' ? 'Spanish preferred' : 'English preferred'})
   - Match user's experience level (${userProfile.experienceLevel})
   - Respond to user sentiment appropriately (${userProfile.sentiment})

2. **Content Guidelines:**
   - Provide accurate, detailed information about specific NFTs
   - Include price comparisons and rarity information when relevant
   - Explain blockchain concepts in accessible terms
   - Highlight unique features and artistic value
   - Mention museum locations and experiences when appropriate

3. **Response Structure Based on Intent:**
   - **Price Inquiries:** Include POL price, USD equivalent, and value proposition
   - **Museum Info:** Provide complete location details, hours, and contact information
   - **Purchase Info:** Explain the minting process and requirements
   - **Rarity Info:** Compare rarity levels and explain what makes pieces special
   - **Technical Info:** Explain blockchain benefits in user-friendly terms
   - **Collection Overview:** Provide curated highlights based on user interests

4. **Enhanced Features:**
   - Suggest related NFTs based on user interests
   - Provide investment insights when appropriate
   - Explain the cultural significance of pieces
   - Offer museum visit recommendations
   - Include relevant links or next steps

5. **Current Market Data:**
   - 1 POL ≈ $0.50 USD
   - 1 USD ≈ 20 MXN
   - Collection floor price: 0.5 POL (CHIDO)
   - Most valuable: YSL at 35,259 POL

**Your Response (be comprehensive but concise):**`;

    console.log('Sending enhanced request to AI model...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text() || "I couldn't generate a response at this time.";
    
    // Cache the successful response
    cacheResponse(cacheKey, responseText);
    
    return responseText;
  } catch (error) {
    console.error('Error processing with AI:', error);
    
    // If there's a cached response, return it as a fallback
    const fallbackResponse = getCachedResponse(cacheKey);
    if (fallbackResponse) {
      console.log('Using cached response as fallback');
      return fallbackResponse;
    }
    // Use intelligent fallback instead of generic error
    return getIntelligentFallback(userInput);
  }
};

/**
 * Intelligent fallback responses when AI is not available
 */
export const getIntelligentFallback = (userInput: string): string => {
  const input = userInput.toLowerCase();
  
  // Price inquiries
  if (input.includes('precio') || input.includes('price') || input.includes('cuánto')) {
    if (input.includes('chido')) {
      return `C.H.I.D.O. es la pieza más accesible de la colección con un precio de solo 0.5 POL (~$0.25 USD). Es perfecto para comenzar tu colección de Arte Eterno.`;
    }
    if (input.includes('ysl') || input.includes('libertad')) {
      return `"Yo Soy Libertad" es la pieza más valiosa de la colección con un precio de 35,259 POL (~$17,629.50 USD). Es una obra legendaria con un poderoso mensaje sobre la libertad.`;
    }
    return `Los precios en la colección Arte Eterno van desde 0.5 POL (CHIDO) hasta 35,259 POL (Yo Soy Libertad). ¿Te interesa alguna pieza en particular?`;
  }
  
  // Museum information
  if (input.includes('museo') || input.includes('museum') || input.includes('ubicación') || input.includes('location')) {
    return `El Museo de Arte Contemporáneo de Quintana Roo tiene dos ubicaciones:
    
📍 **Playa del Carmen**: 5ta Avenida entre Calle 14 y 16
⏰ Martes a Domingo: 10:00 AM - 8:00 PM
📞 +52 984 803 4858

📍 **Cancún - La Isla**: La Isla Shopping Village
⏰ Lunes a Domingo: 10:00 AM - 10:00 PM  
📞 +52 998 176 8330`;
  }
  
  // Collection overview
  if (input.includes('colección') || input.includes('collection') || input.includes('todos')) {
    return `La colección Arte Eterno incluye 16 piezas únicas de arte digital en blockchain Polygon:

🎨 **Destacados:**
• YSL - Yo Soy Libertad (35,259 POL) - Legendario
• TEM - Tides of the Eternal Mind (8,903 POL) - Ultra Raro
• RAI - regenAIssance (13,353 POL) - Muy Raro
• CHIDO - C.H.I.D.O. (0.5 POL) - Accesible para todos

Cada NFT está almacenado en IPFS y ofrece utilidades únicas en el ecosistema del museo.`;
  }
  
  // Technical information
  if (input.includes('blockchain') || input.includes('polygon') || input.includes('tecnología')) {
    return `La colección Arte Eterno utiliza tecnología blockchain avanzada:

⛓️ **Blockchain**: Polygon (bajas comisiones, transacciones rápidas)
📄 **Estándar**: ERC1155 Edition Drop
💾 **Almacenamiento**: IPFS descentralizado
🔒 **Seguridad**: Contratos verificados y auditados

Esto garantiza la autenticidad, propiedad y accesibilidad permanente de tu arte digital.`;
  }
  
  // Default response
  return `¡Hola! Soy tu asistente especializado en la colección Arte Eterno del Museo de Arte Contemporáneo de Quintana Roo. 

Puedo ayudarte con:
🎨 Información sobre las 16 piezas únicas
💰 Precios y rareza de los NFTs
🏛️ Ubicaciones del museo
🔗 Tecnología blockchain y compras
🌟 Recomendaciones personalizadas

¿Qué te gustaría saber sobre nuestra colección?`;
};

/**
 * Get a summary of the collection for context
 */
export const getCollectionSummary = (): string => {
  const kb = getEnhancedKnowledgeBase();
  return `The Arte Eterno Collection is a curated selection of ${kb.collection.totalPieces} unique digital art NFTs on the ${kb.collection.blockchain} blockchain, 
showcasing a diverse range of styles and themes from various artists. The collection includes pieces like:

1. TEM - Tides of the Eternal Mind (8,903 POL) - Abstract/Conceptual, Ultra Rare
2. GCC - Galactic Clean-Up Crew (1,001 POL) - Sci-Fi/Environmental, Rare
3. YSL - Yo Soy Libertad (35,259 POL) - Political/Social, Legendary
4. BBB - Bit-Beats Bliss (400 POL) - Music/Animation, Common
5. CHIDO - C.H.I.D.O. (0.5 POL) - Entry Level, Most Accessible
6. RAI - regenAIssance (13,353 POL) - AI/Technology, Very Rare
7. PSA - Pirolisaurio: Born from the Fossil Age (12,020 POL) - Environmental/Prehistoric, Very Rare
8. EVC - C0mMzoVeRLoAD (3,557 POL) - Digital/Glitch, Rare
9. TRG - Treegeneration (276 POL) - Nature/Environmental, Common

Each NFT is part of an ERC1155 Edition Drop contract and uses IPFS for media storage. The collection represents 
a blend of traditional art and modern blockchain technology, with each piece offering unique utility and value.

Museum Locations:
- Playa del Carmen: 5ta Avenida entre Calle 14 y 16
- Cancún: La Isla Shopping Village`;
};