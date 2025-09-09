import { useEffect, useRef, useCallback } from 'react';

// Define star type
interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  targetOpacity: number;
  color: string;
}

const StarsBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const isMountedRef = useRef(true);
  const starsRef = useRef<Star[]>([]);
  const resizeTimeoutRef = useRef<number | null>(null);
  
  // Configuration - fixed values for better performance
  const starCount = 80; // Reduced from 100 for better performance
  const colors = ['#ffffff', '#6A11CB', '#2575FC', '#9D50BB', '#4CC9F0'];
  
  // Initialize stars with precomputed colors
  const initStars = useCallback((width: number, height: number) => {
    const newStars: Star[] = [];
    
    for (let i = 0; i < starCount; i++) {
      newStars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 1 + Math.random() * 1.5,
        opacity: 0,
        speed: 0.05 + Math.random() * 0.15,
        targetOpacity: 0.2 + Math.random() * 0.8,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    
    starsRef.current = newStars;
  }, [starCount, colors]);
  
  // Setup canvas
  const setupCanvas = useCallback((canvas: HTMLCanvasElement) => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap DPR for performance
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Set canvas size
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    
    // Get 2D context
    const context = canvas.getContext('2d');
    if (!context) {
      return null;
    }
    
    // Configure context
    context.scale(dpr, dpr);
    context.fillStyle = '#050505';
    context.fillRect(0, 0, width, height);
    
    return { width, height };
  }, []);
  
  // Animation loop - optimized for performance
  const animate = useCallback((time: number) => {
    if (!isMountedRef.current) return;
    
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Clear canvas with semi-transparent black for trail effect
        ctx.fillStyle = 'rgba(5, 5, 5, 0.15)'; // Reduced opacity for better performance
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw stars
        for (const star of starsRef.current) {
          // Update opacity with easing
          star.opacity += (star.targetOpacity - star.opacity) * 0.02;
          
          // Randomly change target opacity less frequently
          if (Math.random() < 0.002) { // Reduced frequency
            star.targetOpacity = 0.2 + Math.random() * 0.8;
          }
          
          // Skip drawing if opacity is too low for better performance
          if (star.opacity < 0.1) continue;
          
          // Draw star with simpler approach for better performance
          const [r, g, b] = star.color.match(/\w\w/g)?.map(x => parseInt(x, 16)) || [255, 255, 255];
          
          // Draw the star with a simpler approach
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${star.opacity})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fill();
          
          // Add a small bright point in the center only for brighter stars
          if (star.opacity > 0.5) {
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * 0.7})`;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size * 0.3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }
    
    animationRef.current = requestAnimationFrame(animate);
  }, []);
  
  // Handle window resize with debounce
  const handleResize = useCallback(() => {
    if (resizeTimeoutRef.current !== null) {
      window.clearTimeout(resizeTimeoutRef.current);
    }
    
    resizeTimeoutRef.current = window.setTimeout(() => {
      const canvas = canvasRef.current;
      if (!isMountedRef.current || !canvas) return;
      
      const dims = setupCanvas(canvas);
      if (dims) {
        initStars(dims.width, dims.height);
      }
    }, 150); // Increased debounce time
  }, [initStars, setupCanvas]);
  
  // Initialize component
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Setup canvas and get dimensions
    const dimensions = setupCanvas(canvas);
    if (!dimensions) return;
    
    // Initialize stars with current dimensions
    initStars(dimensions.width, dimensions.height);
    
    // Set mounted flag
    isMountedRef.current = true;
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate);
    
    // Add event listeners
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      isMountedRef.current = false;
      
      // Cancel animation frame
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      
      // Clear any pending timeouts
      if (resizeTimeoutRef.current !== null) {
        window.clearTimeout(resizeTimeoutRef.current);
        resizeTimeoutRef.current = null;
      }
      
      // Remove event listeners
      window.removeEventListener('resize', handleResize);
    };
  }, [initStars, setupCanvas, animate, handleResize]);
  
  return <canvas ref={canvasRef} style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
    pointerEvents: 'none',
  }} />;
};

export default StarsBackground;
