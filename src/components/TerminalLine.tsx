import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TerminalLineProps {
  text: string;
  color?: string;
  command?: boolean;
  delay?: number;
  skipAnimation?: boolean;
}

const TerminalLine: React.FC<TerminalLineProps> = ({ 
  text, 
  color = 'white', 
  command = false, 
  delay = 0,
  skipAnimation = false
}) => {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isTyping, setIsTyping] = useState(!skipAnimation);

  // Blinking cursor effect
  useEffect(() => {
    if (isTyping) return;
    
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    
    return () => clearInterval(cursorInterval);
  }, [isTyping]);

  // Typing effect
  useEffect(() => {
    if (skipAnimation) {
      setDisplayText(text);
      setIsTyping(false);
      return;
    }

    let currentIndex = 0;
    setDisplayText('');
    setIsTyping(true);

    const typingInterval = setInterval(() => {
      if (currentIndex >= text.length) {
        clearInterval(typingInterval);
        setIsTyping(false);
        return;
      }

      setDisplayText(prev => prev + text[currentIndex]);
      currentIndex++;
    }, 5 + Math.random() * 10); // Faster typing speed

    return () => clearInterval(typingInterval);
  }, [text, skipAnimation]);

  const textColor = {
    red: 'text-red-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    cyan: 'text-cyan-300',
    white: 'text-gray-100',
    gray: 'text-gray-400',
  }[color] || 'text-white';

  // Calculate text shadow based on color
  const textShadow = {
    red: '0 0 5px rgba(248, 113, 113, 0.5)',
    green: '0 0 5px rgba(74, 222, 128, 0.5)',
    yellow: '0 0 5px rgba(250, 204, 21, 0.5)',
    blue: '0 0 5px rgba(96, 165, 250, 0.5)',
    purple: '0 0 5px rgba(192, 132, 252, 0.5)',
    cyan: '0 0 8px rgba(103, 232, 249, 0.7)',
    white: '0 0 5px rgba(255, 255, 255, 0.5)',
    gray: '0 0 5px rgba(156, 163, 175, 0.3)',
  }[color] || 'none';

  return (
    <motion.div 
      className={`font-mono text-base ${textColor} flex items-start leading-relaxed`}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: skipAnimation ? 0 : 0.1 + (delay || 0), duration: 0.2 }}
      style={{ textShadow }}
    >
      {command && (
        <span className="text-green-400 font-bold mr-2 select-none">$</span>
      )}
      <div className="relative">
        <span className="whitespace-pre-line">{displayText}</span>
        {!isTyping && showCursor && !skipAnimation && (
          <span 
            className="inline-block w-2.5 h-6 bg-green-400 ml-0.5 -mb-1 opacity-80"
            style={{
              animation: 'blink 1s step-end infinite',
              position: 'absolute',
              bottom: '2px',
            }}
          />
        )}
      </div>
    </motion.div>
  );
};

export default TerminalLine;
