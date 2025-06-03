import type { NftContext, ChatNftData } from './useChatbot';

interface ProcessMessageParams {
  userInput: string;
  model: any; // Replace with the correct type for your model
  findNftInText: (text: string) => ChatNftData | null;
  formatNftPrice: (nft: ChatNftData | null, showUSD?: boolean) => string;
  formatNftInfo: (nft: ChatNftData, isSpanish: boolean) => string;
}

export const processUserMessage = async ({
  userInput,
  model,
  findNftInText,
  formatNftPrice,
  formatNftInfo
}: ProcessMessageParams): Promise<string> => {
  try {
    const lowerInput = userInput.toLowerCase();
    const isSpanish = /\b(hola|como|qué|dónde|cuándo|por qué|cuánto|cuál|cuáles|gracias|por favor|ayuda)\b/i.test(lowerInput);
    
    // Check for price queries
    const priceQuery = /\b(precio|price|cu[aá]nto cuesta|how much does it cost)\b/i.test(lowerInput);
    if (priceQuery) {
      const nft = findNftInText(userInput);
      if (nft) {
        return formatNftPrice(nft, isSpanish);
      }
    }
    
    // Check for general NFT information
    const nft = findNftInText(userInput);
    if (nft) {
      return formatNftInfo(nft, isSpanish);
    }
    
    // If we get here, use AI for the response if available
    if (!model) {
      return isSpanish
        ? 'Lo siento, el servicio de IA no está disponible en este momento. ' +
           'Puedo ayudarte con información sobre precios y detalles de los NFTs de la colección Arte Eterno. ' +
           '¿Sobre qué NFT te gustaría saber más?'
        : 'I\'m sorry, the AI service is not available at the moment. ' +
           'I can help you with information about prices and details of the Arte Eterno collection NFTs. ' +
           'Which NFT would you like to know more about?';
    }
    
    // Prepare context for the AI
    const context: NftContext = {
      collectionInfo: 'A curated collection of digital art from emerging and established artists on the Polygon blockchain.',
      marketData: {
        floorPrice: '0.5 POL',
        totalVolume: '1000 POL',
        owners: 150
      },
      currencyRates: {
        maticToUSD: 0.7,
        usdToMXN: 17.5
      }
    };
    
    const response = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            { text: `User question: ${userInput}` },
            { text: `Context: ${JSON.stringify(context, null, 2)}` },
            { text: 'Please respond in the same language as the question. ' +
                   'If the question is about prices, include values in POL, USD, and MXN.' }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });
    
    const result = await response.response;
    const text = await result.text();
    
    if (!text) {
      throw new Error('Failed to generate response');
    }
    
    return text;
  } catch (error) {
    console.error('Error in processUserMessage:', error);
    return 'Lo siento, hubo un error al procesar tu mensaje. Por favor, inténtalo de nuevo más tarde.\n\n' +
           'I\'m sorry, there was an error processing your message. Please try again later.';
  }
};
