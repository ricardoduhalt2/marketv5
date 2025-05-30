import * as React from 'react';
const { useEffect, useRef } = React;

const StarsBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Configuración
    const colors = ['#ffffff', '#6A11CB', '#2575FC', '#9D50BB', '#4CC9F0'];
    const starCount = 100;
    
    // Definir el tipo de estrella
    interface Star {
      x: number;
      y: number;
      size: number;
      opacity: number;
      speed: number;
      targetOpacity: number;
    }
    
    const stars: Star[] = [];
    
    // Inicializar estrellas
    const initStars = () => {
      console.log('Inicializando estrellas...');
      stars.length = 0;
      
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: 1 + Math.random() * 1.5,
          opacity: 0,
          speed: 0.05 + Math.random() * 0.15,
          targetOpacity: 0.2 + Math.random() * 0.8,
        });
      }
      
      console.log(`Se crearon ${stars.length} estrellas`);
    };
    
    // Dibujar estrellas
    const draw = () => {
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Limpiar el canvas con un fondo semi-transparente para el efecto de estela
      ctx.fillStyle = 'rgba(5, 5, 5, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Actualizar y dibujar estrellas
      for (const star of stars) {
        // Actualizar opacidad con suavizado
        star.opacity += (star.targetOpacity - star.opacity) * 0.02;
        
        // Cambiar opacidad objetivo de vez en cuando
        if (Math.random() < 0.005) {
          star.targetOpacity = 0.2 + Math.random() * 0.8;
        }
        
        // Solo dibujar si la opacidad es mayor a 0.1 para mejor rendimiento
        if (star.opacity < 0.1) continue;
        
        // Dibujar estrella con gradiente
        const gradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.size * 2
        );
        
        // Elegir un color aleatorio de la paleta
        const color = colors[Math.floor(Math.random() * colors.length)];
        const [r, g, b] = color.match(/\w\w/g)?.map(x => parseInt(x, 16)) || [255, 255, 255];
        
        // Configurar gradiente
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
        gradient.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${star.opacity * 0.7})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        
        // Dibujar la estrella
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Añadir un pequeño punto brillante en el centro
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    
    // Bucle de animación
    let animationFrameId: number | null = null;
    let lastTime = 0;
    
    const animate = (time: number) => {
      if (!lastTime) lastTime = time;
      // No necesitamos deltaTime por ahora, pero lo dejamos para futuras mejoras
      // const deltaTime = time - lastTime;
      lastTime = time;
      
      draw();
      animationFrameId = requestAnimationFrame(animate);
    };
    
    
    // Inicializar estrellas y configurar el canvas
    const initialize = () => {
      if (!canvas) return;
      
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Configurar el tamaño del canvas
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      // Obtener el contexto 2D
      const context = canvas.getContext('2d');
      if (!context) {
        console.error('No se pudo obtener el contexto 2D del canvas');
        return;
      }
      
      // Configurar el contexto
      context.scale(dpr, dpr);
      context.fillStyle = '#050505';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Inicializar estrellas
      initStars();
    };
    
    // Agregar event listener para redimensionamiento con debounce
    let resizeTimeout: NodeJS.Timeout;
    const handleResizeWithDebounce = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        initialize();
      }, 100);
    };
    
    window.addEventListener('resize', handleResizeWithDebounce);
    
    // Inicializar
    initialize();
    animationFrameId = requestAnimationFrame(animate);
    
    // Limpiar
    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('resize', handleResizeWithDebounce);
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
    };
  }, []);
  
  return React.createElement('canvas', {
    ref: canvasRef,
    style: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      pointerEvents: 'none',
    }
  });
};

export default StarsBackground;
