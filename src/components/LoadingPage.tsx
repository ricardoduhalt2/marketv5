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
      <div className="hud-overlay" />
      
      {/* Grid Background */}
      <svg className="hud-lines" width="100%" height="100%">
        {hudLines.map((line, index) => (
          <line
            key={index}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={line.color || 'rgba(0, 200, 255, 0.1)'}
            strokeWidth={line.width || 1}
            strokeOpacity={line.opacity}
            strokeDasharray={line.dashArray}
            strokeDashoffset={line.dashOffset}
          />
        ))}
      </svg>
      
      {/* Corner Decorations */}
      <div className="hud-corner hud-corner-tl" />
      <div className="hud-corner hud-corner-tr" />
      <div className="hud-corner hud-corner-bl" />
      <div className="hud-corner hud-corner-br" />
      
      {/* Animated Scan Line */}
      <div className="hud-scanline" style={{ transform: `translateY(${progress}%)` }} />
      
      <div className="hud-content">
        <div className="status-display">
          <div className="status-title">System Status</div>
          <div className="status-value">{status}</div>
          <div className="status-subtitle">{subStatus}</div>
        </div>
        
        <div className="progress-section">
          <div className="progress-labels">
            <span>Loading</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="hud-progress-container">
            <div 
              className="hud-progress-bar" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
