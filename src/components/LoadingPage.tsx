import React, { useState, useEffect, useCallback, useRef } from 'react';
import './LoadingPage.css';
import { 
  INITIAL_TERMINAL_LINES, 
  DEPENDENCIES_TO_INSTALL, 
  FINAL_MESSAGES, 
  Star,
  ShootingStar,
  TerminalLine,
  Spark
} from '@/constants';

const NUM_STARS = 250;
const NUM_SHOOTING_STARS = 4;
const SPARK_COUNT = 20;
const SPARK_LIFESPAN_MIN = 0.3;
const SPARK_LIFESPAN_MAX = 0.8;

const LoadingPage: React.FC = () => {
  const [stars, setStars] = useState<Star[]>([]);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [currentTypedLine, setCurrentTypedLine] = useState<string>("");
  const [isTypingDependency, setIsTypingDependency] = useState<boolean>(false);
  const [showCursor, setShowCursor] = useState<boolean>(true);
  const [processingFinalMessages, setProcessingFinalMessages] = useState<boolean>(false);
  const [currentFinalMessageIdx, setCurrentFinalMessageIdx] = useState<number>(0);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const terminalContentRef = useRef<HTMLDivElement>(null);

  // Efecto para el desplazamiento automático
  useEffect(() => {
    if (terminalContentRef.current) {
      terminalContentRef.current.scrollTop = terminalContentRef.current.scrollHeight;
    }
  }, [terminalLines]);

  // Radio base para los anillos - ajustado para el tamaño del container
  const baseRadius = 85; // Radio base para dispositivos móviles
  const orangeRingRadius = baseRadius; // Anillo exterior naranja
  const blueRingRadius = baseRadius * 0.75; // Anillo interior azul (75% del exterior)

  const orangeRingSegments = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * 2 * Math.PI; 
    return {
      id: `segment-${i}`,
      x: Math.cos(angle) * orangeRingRadius,
      y: Math.sin(angle) * orangeRingRadius,
      rotation: angle * (180 / Math.PI) + 90, 
      glitchDelay: `${Math.random() * 2}s`,
    };
  });

  const blueRingNodes = Array.from({ length: 3 }, (_, i) => {
    const angle = (i / 3) * 2 * Math.PI;
    return {
      id: `node-${i}`,
      x: Math.cos(angle) * blueRingRadius,
      y: Math.sin(angle) * blueRingRadius,
    };
  });

  useEffect(() => {
    // Generate stars with more vibrant colors and realistic distribution
    const newStars: Star[] = [];
    const starColors = [
      { 
        bg: 'bg-blue-400', 
        shadow: 'shadow-[0_0_10px_2px_rgba(96,165,250,0.8)]', 
        hex: '#60a5fa',
        tailFade: 'rgba(96,165,250,0)'
      },
      { 
        bg: 'bg-purple-400', 
        shadow: 'shadow-[0_0_10px_2px_rgba(192,132,252,0.8)]', 
        hex: '#c084fc',
        tailFade: 'rgba(192,132,252,0)'
      },
      { 
        bg: 'bg-pink-400', 
        shadow: 'shadow-[0_0_10px_2px_rgba(244,114,182,0.8)]', 
        hex: '#f472b6',
        tailFade: 'rgba(244,114,182,0)'
      },
      { 
        bg: 'bg-cyan-300', 
        shadow: 'shadow-[0_0_10px_2px_rgba(103,232,249,0.8)]', 
        hex: '#67e8f9',
        tailFade: 'rgba(103,232,249,0)'
      },
      { 
        bg: 'bg-yellow-300', 
        shadow: 'shadow-[0_0_10px_2px_rgba(253,224,71,0.8)]', 
        hex: '#fde047',
        tailFade: 'rgba(253,224,71,0)'
      },
      { 
        bg: 'bg-white', 
        shadow: 'shadow-[0_0_10px_2px_rgba(255,255,255,0.8)]', 
        hex: '#ffffff',
        tailFade: 'rgba(255,255,255,0)'
      }
    ];

    for (let i = 0; i < NUM_STARS; i++) {
      const visual = starColors[Math.floor(Math.random() * starColors.length)];
      const size = Math.random() > 0.9 ? 'w-1.5 h-1.5' : 
                  Math.random() > 0.7 ? 'w-1 h-1' : 'w-0.5 h-0.5';
      
      // Create clusters of stars for more realistic distribution
      let x, y;
      if (Math.random() > 0.3) {
        // Cluster stars in certain areas
        const clusterX = Math.random() * 80 + 10; // 10-90% to avoid edges
        const clusterY = Math.random() * 80 + 10;
        x = Math.max(0, Math.min(100, clusterX + (Math.random() * 20 - 10)));
        y = Math.max(0, Math.min(100, clusterY + (Math.random() * 20 - 10)));
      } else {
        // Some random stars for variety
        x = Math.random() * 100;
        y = Math.random() * 100;
      }

      newStars.push({
        id: i,
        x: x,
        y: y,
        sizeClass: size,
        colorClass: visual.bg,
        shadowClass: visual.shadow,
        animationDelay: `${Math.random() * 15}s`,
        animationDuration: `${3 + Math.random() * 10}s`,
      });
    }
    setStars(newStars);

    // Generate shooting stars with more realistic and varied trajectories
    const newShootingStarsData: ShootingStar[] = [];
    const shootingStarColors = [
      { 
        hex: '#60a5fa', 
        tailFade: 'rgba(96,165,250,0)',
        bg: 'bg-blue-400',
        shadow: 'shadow-[0_0_10px_2px_rgba(96,165,250,0.8)]'
      }, // blue
      { 
        hex: '#c084fc', 
        tailFade: 'rgba(192,132,252,0)',
        bg: 'bg-purple-400',
        shadow: 'shadow-[0_0_10px_2px_rgba(192,132,252,0.8)]'
      }, // purple
      { 
        hex: '#f472b6', 
        tailFade: 'rgba(244,114,182,0)',
        bg: 'bg-pink-400',
        shadow: 'shadow-[0_0_10px_2px_rgba(244,114,182,0.8)]'
      }, // pink
      { 
        hex: '#67e8f9', 
        tailFade: 'rgba(103,232,249,0)',
        bg: 'bg-cyan-300',
        shadow: 'shadow-[0_0_10px_2px_rgba(103,232,249,0.8)]'
      }, // cyan
      { 
        hex: '#fde047', 
        tailFade: 'rgba(253,224,71,0)',
        bg: 'bg-yellow-300',
        shadow: 'shadow-[0_0_10px_2px_rgba(253,224,71,0.8)]'
      }, // yellow
      { 
        hex: '#ffffff', 
        tailFade: 'rgba(255,255,255,0)',
        bg: 'bg-white',
        shadow: 'shadow-[0_0_10px_2px_rgba(255,255,255,0.8)]'
      }  // white
    ];

    for (let i = 0; i < NUM_SHOOTING_STARS; i++) {
      const visual = shootingStarColors[Math.floor(Math.random() * shootingStarColors.length)];
      // More natural angle range
      const angleDeg = -20 - Math.random() * 50; 
      const angleRad = angleDeg * (Math.PI / 180);
      
      // Start from edges more often for better visibility
      let sx, sy, tx, ty;
      const startFromTop = Math.random() > 0.7;
      const startFromLeft = Math.random() > 0.5;
      
      if (startFromTop) {
        // Start from top
        sx = startFromLeft ? -10 : 110;
        sy = Math.random() * 40; // Top 40%
      } else {
        // Start from sides
        sx = startFromLeft ? -10 : 110;
        sy = Math.random() * 100;
      }

      // Calculate end point based on angle and start position
      const distance = 120 + Math.random() * 80; // Longer trails
      tx = sx + Math.cos(angleRad) * distance * (startFromLeft ? 1 : -1);
      ty = sy + Math.sin(angleRad) * distance;
      
      // Create gradient with more vibrant colors
      const gradient = `linear-gradient(
        to right, 
        ${visual.hex} 0%, 
        ${visual.hex} 30%, 
        ${visual.hex} 50%, 
        ${visual.tailFade} 100%
      )`;

      newShootingStarsData.push({
        id: Date.now() + i + Math.random(),
        startX: `${sx}vw`,
        startY: `${sy}vh`,
        travelX: `${tx - sx}vw`,
        travelY: `${ty - sy}vh`,
        angle: `${angleDeg}deg`,
        animationDelay: `${Math.random() * 15}s`,
        animationDuration: `${1.5 + Math.random() * 2}s`,
        headColorHex: visual.hex,
        tailColorHexFade: visual.tailFade,
        gradient: gradient,
      });
    }
    setShootingStars(newShootingStarsData);
  }, []);

  // Función para generar chispas
  const generateSparks = useCallback(() => {
    const newSparks: Spark[] = [];
    const segment = orangeRingSegments[Math.floor(Math.random() * orangeRingSegments.length)];
    
    for (let i = 0; i < SPARK_COUNT; i++) {
      const angle = Math.atan2(segment.y, segment.x);
      const spread = (Math.random() - 0.5) * 0.5;
      const emissionAngle = angle + spread;
      const speed = 34 + Math.random() * 34;
      const duration = SPARK_LIFESPAN_MIN + Math.random() * (SPARK_LIFESPAN_MAX - SPARK_LIFESPAN_MIN);
      
      newSparks.push({
        id: `spark-${Date.now()}-${i}`,
        x: segment.x,
        y: segment.y,
        dx: Math.cos(emissionAngle) * speed * duration,
        dy: Math.sin(emissionAngle) * speed * duration,
        size: 1 + Math.random() * 2,
        duration: duration,
        delay: Math.random() * 0.5,
        color: 'bg-orange-400',
      });
    }
    setSparks(newSparks);
  }, [orangeRingSegments]);

  // Efecto para generar chispas periódicamente
  useEffect(() => {
    generateSparks();
    const interval = setInterval(generateSparks, 2000);
    return () => clearInterval(interval);
  }, [generateSparks]);

  // Función para el tipado de texto
  const typeLine = useCallback((line: Omit<TerminalLine, 'id'>, onComplete: () => void) => {
    let charIndex = 0;
    setCurrentTypedLine("");
    setIsTypingDependency(true);
    
    const typingInterval = setInterval(() => {
      if (charIndex < line.text.length) {
        setCurrentTypedLine(prev => prev + line.text[charIndex]);
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setTerminalLines(prev => [...prev, { ...line, id: prev.length }]);
        setCurrentTypedLine("");
        setIsTypingDependency(false);
        onComplete();
      }
    }, 20);
    
    return () => clearInterval(typingInterval);
  }, [setCurrentTypedLine, setIsTypingDependency, setTerminalLines]);

  useEffect(() => {
    let currentLineIdx = 0;
    let currentDependencyIdx = 0;
    let timeoutId: NodeJS.Timeout;

    const processNext = () => {
      if (currentLineIdx < INITIAL_TERMINAL_LINES.length) {
        const line = INITIAL_TERMINAL_LINES[currentLineIdx];
        timeoutId = setTimeout(() => {
          setTerminalLines(prev => [...prev, { ...line, id: prev.length }]);
          currentLineIdx++;
          processNext();
        }, line.text === "" ? 150 : 300);
      } else if (currentDependencyIdx < DEPENDENCIES_TO_INSTALL.length) {
        const dep = DEPENDENCIES_TO_INSTALL[currentDependencyIdx];
        const lineToType: Omit<TerminalLine, 'id'> = {
          text: `Installing ${dep.name}...`,
          colorClass: "text-yellow-400",
          prefix: "[PKG]",
          prefixColorClass: "text-purple-400"
        };
        
        typeLine(lineToType, () => {
          timeoutId = setTimeout(() => {
            if (dep.detail) {
              setTerminalLines(prev => [...prev, { 
                id: prev.length, 
                text: `  > ${dep.detail}`, 
                colorClass: "text-gray-500"
              }]);
            }
            
            setTerminalLines(prev => [...prev, { 
              id: prev.length, 
              text: `${dep.name} installation successful.`, 
              colorClass: "text-green-400", 
              prefix: "[OK]", 
              prefixColorClass: "text-green-400"
            }]);
            
            currentDependencyIdx++;
            if (currentDependencyIdx === DEPENDENCIES_TO_INSTALL.length) {
              setProcessingFinalMessages(true);
            }
            processNext();
          }, dep.time / 2.5);
        });
      } else if (processingFinalMessages && currentFinalMessageIdx < FINAL_MESSAGES.length) {
        const line = FINAL_MESSAGES[currentFinalMessageIdx];
        timeoutId = setTimeout(() => {
          setTerminalLines(prev => [...prev, { ...line, id: prev.length }]);
          setCurrentFinalMessageIdx(prev => prev + 1);
          if (currentFinalMessageIdx + 1 < FINAL_MESSAGES.length) {
            processNext();
          }
        }, line.text === "" ? 150 : 700);
      }
    };

    processNext();
    return () => clearTimeout(timeoutId);
  }, [typeLine, processingFinalMessages, currentFinalMessageIdx]);

  useEffect(() => {
    const cursorInterval = setInterval(() => setShowCursor(prev => !prev), 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className="loading-page-container">
      {/* Background Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className={`star-element ${star.sizeClass} ${star.colorClass} ${star.shadowClass}`}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            animationDuration: star.animationDuration,
            animationDelay: star.animationDelay,
          }}
        />
      ))}

      {/* Realistic Shooting Stars */}
      {shootingStars.map((star) => (
        <div
          key={star.id}
          className="shooting-star-element"
          style={{
            width: '80px',
            background: star.gradient,
            filter: `drop-shadow(0 0 6px ${star.headColorHex}) drop-shadow(0 0 10px ${star.headColorHex})`,
            animationDuration: star.animationDuration,
            animationDelay: star.animationDelay,
            // @ts-ignore
            '--start-x': star.startX,
            '--start-y': star.startY,
            '--travel-x': star.travelX,
            '--travel-y': star.travelY,
            '--angle': star.angle,
          }}
        />
      ))}

      {/* Titles */}
      <div className="titles-container">
        <h1 className="main-title">
          NFT Boutique Marketplace
        </h1>
        <h2 className="subtitle">
          Arte Eterno Collection - MACQ
        </h2>
      </div>
      
      {/* Spinner Container */}
      <div className="spinner-container">
        {/* Disco Principal con Glow */}
        <div className="spinner-disc"></div>

        {/* Anillo Interior Azul */}
        <div className="ring-container blue-ring-container">
          {/* Path/borde del anillo azul */}
          <div 
            className="base-ring-path base-blue-ring-path"
            style={{
              width: `${blueRingRadius * 2}px`,
              height: `${blueRingRadius * 2}px`,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
          {/* Nodos del anillo azul */}
          {blueRingNodes.map(node => (
            <div 
              key={node.id}
              className="blue-ring-node"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) translate(${node.x}px, ${node.y}px)`
              }}
            />
          ))}
        </div>

        {/* Anillo Exterior Naranja */}
        <div className="ring-container orange-ring-container">
          {/* Path/borde del anillo naranja */}
          <div 
            className="base-ring-path base-orange-ring-path"
            style={{
              width: `${orangeRingRadius * 2}px`,
              height: `${orangeRingRadius * 2}px`,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
          {/* Segmentos del anillo naranja */}
          {orangeRingSegments.map(segment => (
            <div 
              key={segment.id}
              className="orange-ring-segment"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) translate(${segment.x}px, ${segment.y}px) rotate(${segment.rotation}deg)`,
              }}
            >
              <div className="orange-segment-trail"/>
            </div>
          ))}
          {/* Efectos de glitch */}
          {orangeRingSegments.map((segment, index) => (
            <div
              key={`glitch-${segment.id}`}
              className="segment-glitch-overlay"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) translate(${segment.x * 0.95}px, ${segment.y * 0.95}px)`,
                animationDelay: `${index * 0.1}s`,
                // @ts-ignore
                '--glitch-color-1': 'rgba(52, 211, 153, 0.6)', 
                '--glitch-color-2': 'rgba(234, 179, 8, 0.6)', 
              }}
            />
          ))}
        </div>
        
        {/* Emisor de Chispas */}
        <div className="sparks-emitter">
            {sparks.map(spark => (
                <div
                    key={spark.id}
                    className={`spark-element ${spark.color}`}
                    style={{
                        width: `${spark.size}px`,
                        height: `${spark.size}px`,
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        animation: `sparkAnimation ${spark.duration}s linear ${spark.delay}s forwards`,
                        // @ts-ignore
                        '--spark-dx': `${spark.dx}px`,
                        '--spark-dy': `${spark.dy}px`,
                    }}
                />
            ))}
        </div>
      </div>

      {/* Terminal Output */}
      <div className="terminal-output-container">
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="terminal-buttons">
              <span className="terminal-button close"></span>
              <span className="terminal-button minimize"></span>
              <span className="terminal-button maximize"></span>
            </div>
            <div className="terminal-title">terminal</div>
          </div>
          <div className="terminal-content" ref={terminalContentRef}>
            <div className="text-purple-300/80 text-sm mb-2">// Iniciando sistema de carga...</div>
            <div className="text-slate-400/60 text-xs mb-3">// Versión 1.0.0 - {new Date().toLocaleDateString()}</div>
            {terminalLines.map((line, index) => (
              <div key={index} className="terminal-line">
                {line.prefix && (
                  <span className={`terminal-line-prefix ${line.prefixColorClass || 'text-purple-400'}`}>
                    {line.prefix}
                  </span>
                )}
                <span className={line.colorClass || 'text-gray-300'}>{line.text}</span>
              </div>
            ))}
            {isTypingDependency && (
              <div className="terminal-line">
                <span className="text-purple-400">[PKG]</span>
                <span className="text-yellow-400 ml-2">{currentTypedLine}</span>
                {showCursor && <span className="terminal-cursor"></span>}
              </div>
            )}
            {!isTypingDependency && processingFinalMessages && currentFinalMessageIdx >= FINAL_MESSAGES.length && showCursor && (
              <div className="terminal-line">
                <span className="terminal-cursor"></span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
