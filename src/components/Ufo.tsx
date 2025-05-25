import React from 'react';
import { motion } from 'framer-motion';

const Ufo: React.FC = () => {
  return (
    <motion.div 
      className="relative w-32 h-16"
      initial={{ y: -50, opacity: 0 }}
      animate={{ 
        y: [0, -20, 0],
        opacity: 1,
      }}
      transition={{
        y: {
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        },
        opacity: { duration: 1 }
      }}
    >
      {/* Cuerpo del OVNI */}
      <div className="absolute w-full h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-purple-300 rounded-full blur-sm"></div>
      </div>
      
      {/* Cúpula */}
      <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-16 h-10 bg-gradient-to-b from-blue-300 to-blue-100 rounded-full">
        <div className="absolute inset-0.5 bg-blue-200/30 rounded-full"></div>
      </div>
      
      {/* Luces */}
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <motion.div 
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-blue-300"
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.2,
              repeat: Infinity,
              repeatType: 'reverse' as const
            }}
          />
        ))}
      </div>
      
      {/* Haz de luz */}
      <motion.div 
        className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-gradient-to-t from-blue-500/20 to-transparent"
        animate={{
          scaleX: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </motion.div>
  );
};

export default Ufo;
