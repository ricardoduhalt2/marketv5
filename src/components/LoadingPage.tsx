import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import './LoadingPage.css';
import { 
  INITIAL_TERMINAL_LINES, 
  DEPENDENCIES_TO_INSTALL, 
  FINAL_MESSAGES, 
  TerminalLine,
  Spark
} from '@/constants';
import StarsBackground from './StarsBackground';
import LoadingUfo from './LoadingUfo';

const SPARK_COUNT = 15; // Reducido de 20 a 15
const SPARK_LIFESPAN_MIN = 0.2; // Reducido de 0.3 a 0.2
const SPARK_LIFESPAN_MAX = 0.6; // Reducido de 0.8 a 0.6

// Componentes memoizados para mejor rendimiento
const MemoizedStarsBackground = memo(StarsBackground);
const MemoizedLoadingUfo = memo(LoadingUfo);

const LoadingPage: React.FC = () => {
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [currentTypedLine, setCurrentTypedLine] = useState<string>("");
  const [isTypingDependency, setIsTypingDependency] = useState<boolean>(false);
  const [showCursor, setShowCursor] = useState<boolean>(true);
  const [processingFinalMessages, setProcessingFinalMessages] = useState<boolean>(false);
  const [currentFinalMessageIdx, setCurrentFinalMessageIdx] = useState<number>(0);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const terminalContentRef = useRef<HTMLDivElement>(null);

  // Efecto para el desplazamiento automático - optimizado con requestAnimationFrame
  useEffect(() => {
    if (terminalLines.length > 0 && terminalContentRef.current) {
      requestAnimationFrame(() => {
        if (terminalContentRef.current) {
          terminalContentRef.current.scrollTop = terminalContentRef.current.scrollHeight;
        }
      });
    }
  }, [terminalLines]);

  // Radio base para los anillos - ajustado para el tamaño del container
  const baseRadius = 85; // Radio base para dispositivos móviles
  const orangeRingRadius = baseRadius; // Anillo exterior naranja
  const blueRingRadius = baseRadius * 0.75; // Anillo interior azul (75% del exterior)

  // Memoizar segmentos y nodos para evitar recrearlos en cada render
  const orangeRingSegments = React.useMemo(() => Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * 2 * Math.PI; 
    return {
      id: `segment-${i}`,
      x: Math.cos(angle) * orangeRingRadius,
      y: Math.sin(angle) * orangeRingRadius,
      rotation: angle * (180 / Math.PI) + 90, 
      glitchDelay: `${Math.random() * 2}s`,
    };
  }), [orangeRingRadius]);

  const blueRingNodes = React.useMemo(() => Array.from({ length: 3 }, (_, i) => {
    const angle = (i / 3) * 2 * Math.PI;
    return {
      id: `node-${i}`,
      x: Math.cos(angle) * blueRingRadius,
      y: Math.sin(angle) * blueRingRadius,
    };
  }), [blueRingRadius]);

  // Generate sparks effect - optimizado para mejor rendimiento
  useEffect(() => {
    const generateSparks = () => {
      const newSparks: Spark[] = [];
      
      for (let i = 0; i < SPARK_COUNT; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 25 + Math.random() * 15; // Reducido el rango
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;
        
        newSparks.push({
          id: `spark-${Date.now()}-${i}`,
          x: 0,
          y: 0,
          dx,
          dy,
          size: 1 + Math.random() * 1.5, // Reducido el tamaño máximo
          duration: SPARK_LIFESPAN_MIN + Math.random() * (SPARK_LIFESPAN_MAX - SPARK_LIFESPAN_MIN),
          delay: Math.random() * 0.3, // Reducido el delay máximo
          color: ['bg-yellow-300', 'bg-orange-400', 'bg-red-500'][Math.floor(Math.random() * 3)]
        });
      }
      
      setSparks(newSparks);
      
      // Schedule next spark generation - más rápido
      const timeout = 500 + Math.random() * 1000; // Reducido de 1-3 segundos a 0.5-1.5 segundos
      const timer = setTimeout(() => {
        generateSparks();
      }, timeout);
      
      return () => clearTimeout(timer);
    };
    
    // Initial spark generation
    const cleanup = generateSparks();
    
    // Cleanup on unmount
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  // Función para generar chispas - optimizado
  const generateSparks = useCallback(() => {
    const newSparks: Spark[] = [];
    const segment = orangeRingSegments[Math.floor(Math.random() * orangeRingSegments.length)];
    
    for (let i = 0; i < SPARK_COUNT; i++) {
      const angle = Math.atan2(segment.y, segment.x);
      const spread = (Math.random() - 0.5) * 0.3; // Reducido el spread
      const emissionAngle = angle + spread;
      const speed = 25 + Math.random() * 25; // Reducida la velocidad máxima
      const duration = SPARK_LIFESPAN_MIN + Math.random() * (SPARK_LIFESPAN_MAX - SPARK_LIFESPAN_MIN);
      
      newSparks.push({
        id: `spark-${Date.now()}-${i}`,
        x: segment.x,
        y: segment.y,
        dx: Math.cos(emissionAngle) * speed * duration,
        dy: Math.sin(emissionAngle) * speed * duration,
        size: 1 + Math.random() * 1.5, // Reducido el tamaño máximo
        duration: duration,
        delay: Math.random() * 0.3, // Reducido el delay máximo
        color: 'bg-orange-400',
      });
    }
    setSparks(newSparks);
  }, [orangeRingSegments]);

  // Efecto para generar chispas periódicamente - más frecuente
  useEffect(() => {
    generateSparks();
    const interval = setInterval(generateSparks, 1500); // Reducido de 2000 a 1500
    return () => clearInterval(interval);
  }, [generateSparks]);

  // Función para el tipado de texto - acelerado
  const typeLine = useCallback((line: Omit<TerminalLine, 'id'>, onComplete: () => void) => {
    let charIndex = 0;
    setCurrentTypedLine("");
    setIsTypingDependency(true);
    
    // Acelerar el tipado
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
    }, 5); // Reducido de 10 a 5 ms
    
    return () => clearInterval(typingInterval);
  }, [setCurrentTypedLine, setIsTypingDependency, setTerminalLines]);

  // Procesamiento de líneas de terminal - acelerado
  useEffect(() => {
    let currentLineIdx = 0;
    let currentDependencyIdx = 0;
    let timeoutId: NodeJS.Timeout;

    const processNext = () => {
      if (currentLineIdx < INITIAL_TERMINAL_LINES.length) {
        const line = INITIAL_TERMINAL_LINES[currentLineIdx];
        // Acelerar el proceso
        timeoutId = setTimeout(() => {
          setTerminalLines(prev => [...prev, { ...line, id: prev.length }]);
          currentLineIdx++;
          processNext();
        }, line.text === "" ? 30 : 50); // Acelerado
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
          }, dep.time / 10); // Acelerado aún más
        });
      } else if (processingFinalMessages && currentFinalMessageIdx < FINAL_MESSAGES.length) {
        const line = FINAL_MESSAGES[currentFinalMessageIdx];
        // Acelerar el proceso final
        timeoutId = setTimeout(() => {
          setTerminalLines(prev => [...prev, { ...line, id: prev.length }]);
          setCurrentFinalMessageIdx(prev => prev + 1);
          if (currentFinalMessageIdx + 1 < FINAL_MESSAGES.length) {
            processNext();
          }
        }, line.text === "" ? 30 : 100); // Acelerado
      }
    };

    processNext();
    return () => clearTimeout(timeoutId);
  }, [typeLine, processingFinalMessages, currentFinalMessageIdx]);

  // Efecto de cursor - más rápido
  useEffect(() => {
    const cursorInterval = setInterval(() => setShowCursor(prev => !prev), 400); // Reducido de 500 a 400
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className="loading-page-container">
      {/* Stars Background - memoizado */}
      <MemoizedStarsBackground />

      {/* UFO flotante en la esquina superior derecha - memoizado */}
      <div className="loading-ufo-wrapper">
        <MemoizedLoadingUfo />
      </div>

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
                animationDelay: `${index * 0.05}s`, // Reducido el delay
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
