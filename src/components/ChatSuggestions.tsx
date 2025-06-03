import React from 'react';
import { Suggestion, getQuickActions, getContextualSuggestions } from '../services/suggestionService';
import './ChatSuggestions.css';

interface ChatSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
  messageHistory?: string[];
  currentInput?: string;
  showQuickActions?: boolean;
}

const ChatSuggestions: React.FC<ChatSuggestionsProps> = ({
  onSuggestionClick,
  messageHistory = [],
  currentInput = '',
  showQuickActions = true
}) => {
  const suggestions = showQuickActions 
    ? getQuickActions()
    : getContextualSuggestions(messageHistory, currentInput);

  const handleSuggestionClick = (suggestion: Suggestion) => {
    onSuggestionClick(suggestion.text);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'price': return '💰';
      case 'museum': return '🏛️';
      case 'collection': return '🎨';
      case 'technical': return '🔗';
      case 'popular': return '⭐';
      default: return '💡';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'price': return 'bg-green-500/20 border-green-500/30 hover:bg-green-500/30';
      case 'museum': return 'bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30';
      case 'collection': return 'bg-purple-500/20 border-purple-500/30 hover:bg-purple-500/30';
      case 'technical': return 'bg-orange-500/20 border-orange-500/30 hover:bg-orange-500/30';
      case 'popular': return 'bg-yellow-500/20 border-yellow-500/30 hover:bg-yellow-500/30';
      default: return 'bg-gray-500/20 border-gray-500/30 hover:bg-gray-500/30';
    }
  };

  if (suggestions.length === 0) return null;

  return (
    <div className="chat-suggestions">
      <div className="suggestions-header">
        <span className="suggestions-title">
          {showQuickActions ? '🚀 Acciones rápidas' : '💡 Sugerencias'}
        </span>
      </div>
      <div className="suggestions-grid">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            className={`suggestion-button ${getCategoryColor(suggestion.category)}`}
            onClick={() => handleSuggestionClick(suggestion)}
            title={`Categoría: ${suggestion.category}`}
          >
            <span className="suggestion-icon">
              {getCategoryIcon(suggestion.category)}
            </span>
            <span className="suggestion-text">
              {suggestion.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatSuggestions;