import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface UfoProps {
  size?: number;
  glowColor?: string;
  speed?: number;
}

const Ufo: React.FC<UfoProps> = ({ size = 1, glowColor = 'rgba(138, 43, 226, 0.8)', speed = 1 }) => {
  const controls = useAnimation();
  const beamRef = useRef<HTMLDivElement>(null);
  const lightRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Add subtle floating animation
  useEffect(() => {
    const floatAnimation = async () => {
      while (true) {
        await controls.start({
          y: [0, -10, 0],
          rotate: [0, 0.5, -0.5, 0],
          transition: {
            duration: 4 * speed,
            ease: 'easeInOut',
          },
        });
      }
    };
    floatAnimation();
  }, [controls, speed]);

  // Animate lights
  useEffect(() => {
    const interval = setInterval(() => {
      lightRefs.current.forEach((light) => {
        if (light) {
          const intensity = 0.3 + Math.random() * 0.7;
          light.style.opacity = intensity.toString();
          light.style.transform = `scale(${0.8 + Math.random() * 0.4})`;
        }
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Animate beam
  useEffect(() => {
    if (!beamRef.current) return;
    
    const animateBeam = () => {
      const intensity = 0.3 + Math.random() * 0.3;
      beamRef.current!.style.opacity = intensity.toString();
      requestAnimationFrame(animateBeam);
    };
    
    const frameId = requestAnimationFrame(animateBeam);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const sizeStyle = {
    '--ufo-size': `${size * 1.5}rem`,
    '--glow-color': glowColor,
  } as React.CSSProperties;

  return (
    <motion.div 
      className="relative flex justify-center items-center"
      style={{
        width: 'var(--ufo-size)',
        height: `calc(var(--ufo-size) * 0.6)`,
        ...sizeStyle
      }}
      animate={controls}
    >
      {/* Glow effect */}
      <div 
        className="absolute inset-0 rounded-full opacity-30"
        style={{
          background: `radial-gradient(circle at center, var(--glow-color), transparent 70%)`,
          filter: 'blur(10px)',
        }}
      />
      
      {/* UFO body */}
      <div className="relative w-full h-1/2 rounded-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600"
          style={{
            boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.3)',
          }}
        >
          <div className="absolute inset-0 bg-[radular-gradient(circle_at_center,transparent_50%,rgba(255,255,255,0.1))]" />
        </div>
        
        {/* Windows */}
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 flex justify-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i}
              className="w-1 h-1 rounded-full bg-cyan-300"
              style={{
                boxShadow: '0 0 8px 1px rgba(0, 255, 255, 0.8)',
              }}
            />
          ))}
        </div>
        
        {/* Bottom rim */}
        <div 
          className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-full h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
          style={{
            boxShadow: '0 0 10px 2px rgba(138, 43, 226, 0.5)',
          }}
        />
      </div>
      
      {/* Dome */}
      <div 
        className="absolute -top-1/3 left-1/2 transform -translate-x-1/2 w-3/4 h-3/4 rounded-full overflow-hidden"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(200, 220, 255, 0.9), rgba(120, 150, 255, 0.7))',
          boxShadow: 'inset 0 0 15px rgba(255, 255, 255, 0.5)',
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,transparent_60%,rgba(255,255,255,0.3))]" />
      </div>
      
      {/* Bottom lights */}
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            ref={(el) => {
              if (el) lightRefs.current[i] = el;
            }}
            className="w-1 h-1 rounded-full bg-cyan-300 transition-all duration-300"
            style={{
              boxShadow: '0 0 8px 1px rgba(0, 255, 255, 0.8)',
              opacity: 0.5,
            }}
          />
        ))}
      </div>
      
      {/* Beam */}
      <div 
        ref={beamRef}
        className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-16 h-20 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(138, 43, 226, 0.1), rgba(0, 255, 255, 0.05))',
          clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)',
          opacity: 0.3,
          transition: 'opacity 0.5s ease',
        }}
      />
    </motion.div>
  );
};

export default Ufo;
