import React from 'react';
import { motion } from 'framer-motion';

interface StarsProps {
  count?: number;
}

const Stars: React.FC<StarsProps> = ({ count = 100 }) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const size = Math.random() * 3;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = 2 + Math.random() * 3;
        const colors = [
          'text-blue-300',
          'text-purple-300',
          'text-pink-300',
          'text-yellow-200',
          'text-white'
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        return (
          <motion.div
            key={i}
            className={`absolute ${color} text-opacity-80`}
            style={{
              fontSize: `${size}px`,
              left: `${posX}%`,
              top: `${posY}%`,
              textShadow: '0 0 5px currentColor',
              willChange: 'transform, opacity'
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1.2, 0.5]
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            ★
          </motion.div>
        );
      })}
    </div>
  );
};

export default Stars;
