import React, { useState, useEffect, useRef } from 'react';
import './LoadingPage.css';

interface HUDLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  id?: string;
  width?: number;
  opacity?: number;
  dashArray?: string;
  dashOffset?: number;
  color?: string;
}

const LoadingPage: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('INITIALIZING SYSTEM');
  const [subStatus, setSubStatus] = useState('Establishing quantum link...');
  const [hudLines, setHudLines] = useState<HUDLine[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  // Removed unused dimensions state

  // Create HUD lines based on dimensions
  const createHudLines = (width: number, height: number): HUDLine[] => {
    const lines: HUDLine[] = [];
    const spacing = 50;
    
    // Vertical lines
    for (let x = 0; x < width; x += spacing) {
      lines.push({
        x1: x,
        y1: 0,
        x2: x,
        y2: height,
        opacity: 0.1,
        width: 1,
        dashArray: '5,5',
        dashOffset: 0
      });
    }
    
    // Horizontal lines
    for (let y = 0; y < height; y += spacing) {
      lines.push({
        x1: 0,
        y1: y,
        x2: width,
        y2: y,
        opacity: 0.1,
        width: 1,
        dashArray: '5,5',
        dashOffset: 0
      });
    }
    
    return lines;
  };

  // Initialize HUD elements
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setHudLines(createHudLines(width, height));
      }
    };
    
    // Initial setup
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Simulate loading progress
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1;
        
        // Update status messages based on progress
        if (newProgress < 30) {
          setStatus('INITIALIZING SYSTEM');
          setSubStatus('Booting up quantum processors...');
        } else if (newProgress < 70) {
          setStatus('LOADING ASSETS');
          setSubStatus('Decrypting data streams...');
        } else if (newProgress < 90) {
          setStatus('FINALIZING');
          setSubStatus('Optimizing performance...');
        } else {
          setStatus('READY');
          setSubStatus('All systems nominal');
        }
        
        if (newProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return newProgress;
      });
    }, 100);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="loading-container" ref={containerRef}>
      {/* Galería de NFTs con partículas */}
      
      {/* Imagen de carga */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 5,
        textAlign: 'center'
      }}>
        <div style={{
          width: 'min(80vw, 400px)',
          height: 'min(60vh, 300px)',
          margin: '0 auto',
          position: 'relative'
        }}>
          <img 
            src="https://a37f843ccef648163abc82ab025e7cf7.ipfscdn.io/ipfs/QmfZ3cSxD4Zri5XjCDNEjFyZpnVFa7xPkfYHesKyef3idX/0.jpg" 
            alt="Loading Artwork"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 15px rgba(255, 107, 0, 0.7))',
              opacity: 0.8,
              transition: 'all 0.5s ease',
              animation: 'pulse 3s infinite alternate'
            }}
            onLoad={(e) => {
              (e.target as HTMLImageElement).style.opacity = '0.8';
            }}
          />
          <style dangerouslySetInnerHTML={{
            __html: `
              @keyframes pulse {
                0% { transform: scale(0.95); opacity: 0.7; }
                100% { transform: scale(1.05); opacity: 0.9; }
              }
            `
          }} />
        </div>
      </div>
      
      {/* Capa de superposición HUD */}
      <div className="hud-overlay">
        {/* Particle gallery removed */}
      </div>
      
      {/* Líneas de la cuadrícula HUD */}
      <div className="hud-lines">
        <svg width="100%" height="100%">
          {hudLines.map((line, index) => (
            <line
              key={index}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="rgba(255, 107, 0, 0.1)"
              strokeWidth={line.width || 1}
              strokeDasharray={line.dashArray}
              strokeDashoffset={line.dashOffset}
              opacity={line.opacity}
            />
          ))}
        </svg>
      </div>
      {/* Corner Decorations */}
      <div className="hud-corner hud-corner-tl" />
      <div className="hud-corner hud-corner-tr" />
      <div className="hud-corner hud-corner-bl" />
      <div className="hud-corner hud-corner-br" />
      
      {/* Animated Scan Line */}
      <div className="hud-scanline" style={{ transform: `translateY(${progress}%)` }} />
      
      <div className="hud-content" style={{
        position: 'fixed',
        bottom: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '80%',
        maxWidth: '600px',
        zIndex: 100,
        backgroundColor: 'rgba(5, 5, 10, 0.8)',
        padding: '2rem',
        borderRadius: '15px',
        border: '1px solid rgba(255, 107, 0, 0.5)',
        boxShadow: '0 0 30px rgba(255, 107, 0, 0.3)'
      }}>
        <div className="status-display" style={{
          textAlign: 'center',
          marginBottom: '1.5rem'
        }}>
          <div className="status-title" style={{
            color: '#ff6b00',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>System Status</div>
          <div className="status-value" style={{
            color: '#fff',
            fontSize: '1.8rem',
            fontWeight: 'bold',
            margin: '0.5rem 0',
            textShadow: '0 0 10px rgba(255, 107, 0, 0.7)'
          }}>{status}</div>
          <div className="status-subtitle" style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '1rem',
            fontStyle: 'italic'
          }}>{subStatus}</div>
        </div>
        
        <div className="progress-section">
          <div className="progress-labels" style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.5rem',
            color: 'rgba(255, 255, 255, 0.8)'
          }}>
            <span>Loading</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="hud-progress-container" style={{
            width: '100%',
            height: '20px',
            backgroundColor: 'rgba(255, 107, 0, 0.2)',
            borderRadius: '10px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div 
              className="hud-progress-bar" 
              style={{ 
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #ff6b00, #00a8ff, #0066ff, #ff6b00)',
                backgroundSize: '300% 300%',
                transition: 'width 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                animation: 'borderShimmer 3s ease infinite',
                boxShadow: '0 0 10px rgba(0, 168, 255, 0.5)'
              }}
            >
              <div style={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                animation: 'shimmer 2s infinite',
                transform: 'translateX(-100%)',
                animationTimingFunction: 'ease-in-out'
              }} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Estilos para la animación de brillo */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          @keyframes borderShimmer {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `
      }} />
    </div>
  );
};

export default LoadingPage;
