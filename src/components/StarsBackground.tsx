import { useEffect, useRef, useCallback, useMemo } from 'react';

// Define star type
interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  targetOpacity: number;
}

const StarsBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const isMountedRef = useRef(true);
  const lastTimeRef = useRef(0);
  const starsRef = useRef<Star[]>([]);
  const resizeTimeoutRef = useRef<number | null>(null);
  
  // Configuration - memoize colors array
  const colors = useMemo(() => ['#ffffff', '#6A11CB', '#2575FC', '#9D50BB', '#4CC9F0'], []);
  const starCount = 100;
  
  // Initialize stars - remove dependency on starCount since it's constant
  const initStars = useCallback((width: number, height: number) => {
    console.log('Initializing stars...');
    const newStars: Star[] = [];
    
    for (let i = 0; i < starCount; i++) {
      newStars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 1 + Math.random() * 1.5,
        opacity: 0,
        speed: 0.05 + Math.random() * 0.15,
        targetOpacity: 0.2 + Math.random() * 0.8,
      });
    }
    
    starsRef.current = newStars;
    console.log(`Created ${newStars.length} stars`);
  }, [starCount]);
  
  // Setup canvas
  const setupCanvas = useCallback((canvas: HTMLCanvasElement) => {
    const dpr = window.devicePixelRatio || 1;
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
      console.error('Could not get 2D context');
      return null;
    }
    
    // Configure context
    context.scale(dpr, dpr);
    context.fillStyle = '#050505';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    return { width, height };
  }, []);
  
  // Animation loop - remove colors dependency to prevent re-creation
  const animate = useCallback((time: number) => {
    if (!isMountedRef.current) return;
    
    if (!lastTimeRef.current) lastTimeRef.current = time;
    lastTimeRef.current = time;
    
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Clear canvas with semi-transparent black for trail effect
        ctx.fillStyle = 'rgba(5, 5, 5, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw stars
        for (const star of starsRef.current) {
          // Update opacity with easing
          star.opacity += (star.targetOpacity - star.opacity) * 0.02;
          
          // Randomly change target opacity
          if (Math.random() < 0.005) {
            star.targetOpacity = 0.2 + Math.random() * 0.8;
          }
          
          // Skip drawing if opacity is too low for better performance
          if (star.opacity < 0.1) continue;
          
          // Draw star with gradient
          const gradient = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.size * 2
          );
          
          // Choose a random color from the palette
          const colorIndex = Math.floor(Math.random() * colors.length);
          const color = colors[colorIndex];
          const [r, g, b] = color.match(/\w\w/g)?.map(x => parseInt(x, 16)) || [255, 255, 255];
          
          // Configure gradient
          gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
          gradient.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${star.opacity * 0.7})`);
          gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
          
          // Draw the star
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
          ctx.fill();
          
          // Add a small bright point in the center
          ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    
    animationRef.current = requestAnimationFrame(animate);
  }, []); // Remove colors dependency
  
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
    }, 100);
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
  }, []); // Keep empty dependency array
  
  // Memoize canvas style to prevent unnecessary re-renders
  const canvasStyle = useMemo<React.CSSProperties>(() => ({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
    pointerEvents: 'none',
  }), []);

  return <canvas ref={canvasRef} style={canvasStyle} />;
};

export default StarsBackground;
