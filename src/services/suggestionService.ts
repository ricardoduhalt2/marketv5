/**
/**
 * Intelligent suggestion service for the chatbot
 */

export interface Suggestion {
  id: string;
  text: string;
  category: 'price' | 'museum' | 'collection' | 'technical' | 'popular';
  priority: number;
}

/**
 * Get contextual suggestions based on user interaction history
 */
export const getContextualSuggestions = (
  messageHistory: string[],
  currentInput: string = ''
): Suggestion[] => {
  const suggestions: Suggestion[] = [];
  const input = currentInput.toLowerCase();
  
  // Popular questions
  const popularSuggestions: Suggestion[] = [
    {
      id: 'popular-1',
      text: '¿Cuál es la pieza más valiosa de la colección?',
      category: 'popular',
      priority: 10
    },
    {
      id: 'popular-2', 
      text: '¿Dónde está ubicado el museo?',
      category: 'popular',
      priority: 9
    },
    {
      id: 'popular-3',
      text: '¿Cómo puedo comprar un NFT?',
      category: 'popular',
      priority: 8
    },
    {
      id: 'popular-4',
      text: 'Muéstrame las piezas más accesibles',
      category: 'popular',
      priority: 7
    }
  ];

  // Price-related suggestions
  const priceSuggestions: Suggestion[] = [
    {
      id: 'price-1',
      text: 'Precio de C.H.I.D.O.',
      category: 'price',
      priority: 6
    },
    {
      id: 'price-2',
      text: 'Comparar precios de la colección',
      category: 'price',
      priority: 5
    },
    {
      id: 'price-3',
      text: '¿Qué es POL y cómo se convierte a USD?',
      category: 'price',
      priority: 4
    }
  ];

  // Museum suggestions
  const museumSuggestions: Suggestion[] = [
    {
      id: 'museum-1',
      text: 'Horarios del museo en Playa del Carmen',
      category: 'museum',
      priority: 6
    },
    {
      id: 'museum-2',
      text: 'Ubicación en Cancún La Isla',
      category: 'museum',
      priority: 5
    },
    {
      id: 'museum-3',
      text: 'Eventos especiales del museo',
      category: 'museum',
      priority: 4
    }
  ];

  // Technical suggestions
  const technicalSuggestions: Suggestion[] = [
    {
      id: 'tech-1',
      text: '¿Qué es un NFT y cómo funciona?',
      category: 'technical',
      priority: 5
    },
    {
      id: 'tech-2',
      text: 'Ventajas de usar blockchain Polygon',
      category: 'technical',
      priority: 4
    },
    {
      id: 'tech-3',
      text: '¿Qué es IPFS y por qué es importante?',
      category: 'technical',
      priority: 3
    }
  ];

  // Collection suggestions
  const collectionSuggestions: Suggestion[] = [
    {
      id: 'collection-1',
      text: 'Mostrar todas las piezas de la colección',
      category: 'collection',
      priority: 6
    },
    {
      id: 'collection-2',
      text: 'Piezas por categoría artística',
      category: 'collection',
      priority: 5
    },
    {
      id: 'collection-3',
      text: 'Historia de la colección Arte Eterno',
      category: 'collection',
      priority: 4
    }
  ];

  // Filter suggestions based on context
  if (input.includes('precio') || input.includes('price')) {
    suggestions.push(...priceSuggestions);
  } else if (input.includes('museo') || input.includes('museum')) {
    suggestions.push(...museumSuggestions);
  } else if (input.includes('blockchain') || input.includes('tecnología')) {
    suggestions.push(...technicalSuggestions);
  } else if (input.includes('colección') || input.includes('collection')) {
    suggestions.push(...collectionSuggestions);
  } else {
    // Default to popular suggestions
    suggestions.push(...popularSuggestions.slice(0, 4));
  }

  // Sort by priority and return top suggestions
  return suggestions
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 4);
};

/**
 * Get quick action suggestions
 */
export const getQuickActions = (): Suggestion[] => {
  return [
    {
      id: 'quick-1',
      text: '💰 Ver precios',
      category: 'price',
      priority: 10
    },
    {
      id: 'quick-2',
      text: '🏛️ Ubicaciones',
      category: 'museum',
      priority: 9
    },
    {
      id: 'quick-3',
      text: '🎨 Explorar colección',
      category: 'collection',
      priority: 8
    },
    {
      id: 'quick-4',
      text: '🔗 ¿Cómo comprar?',
      category: 'technical',
      priority: 7
    }
  ];
};

/**
 * Get follow-up suggestions based on the last bot response
 */
export const getFollowUpSuggestions = (lastBotMessage: string): Suggestion[] => {
  const message = lastBotMessage.toLowerCase();
  
  if (message.includes('precio') || message.includes('pol')) {
    return [
      {
        id: 'followup-1',
        text: '¿Cómo puedo comprar esta pieza?',
        category: 'technical',
        priority: 8
      },
      {
        id: 'followup-2',
        text: 'Mostrar piezas similares',
        category: 'collection',
        priority: 7
      }
    ];
  }
  
  if (message.includes('museo') || message.includes('ubicación')) {
    return [
      {
        id: 'followup-3',
        text: '¿Hay eventos especiales?',
        category: 'museum',
        priority: 8
      },
      {
        id: 'followup-4',
        text: 'Horarios de visita',
        category: 'museum',
        priority: 7
      }
    ];
  }
  
  if (message.includes('colección') || message.includes('nft')) {
    return [
      {
        id: 'followup-5',
        text: 'Ver la pieza más popular',
        category: 'collection',
        priority: 8
      },
      {
        id: 'followup-6',
        text: 'Explicar la tecnología blockchain',
        category: 'technical',
        priority: 7
      }
    ];
  }
  
  return getQuickActions().slice(0, 2);
};