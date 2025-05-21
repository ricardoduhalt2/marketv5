import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  color: string;
}

const ParticlesBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isIOS] = useState(() => /iPad|iPhone|iPod/.test(navigator.userAgent));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', {
      alpha: true,
      willReadFrequently: false,
    });
    if (!ctx) return;

    const particles: Particle[] = [];
    const particleCount = isIOS ? 30 : 50; // Reducir partículas en iOS
    const colors = ['#6A11CB', '#2575FC', '#9D50BB', '#6E48AA'];
    
    let animationFrameId: number;
    let lastTime = 0;
    const fps = isIOS ? 30 : 60; // Limitar FPS en iOS
    const fpsInterval = 1000 / fps;

    // Optimización del resize
    const debouncedResize = debounce(() => {
      const dpr = window.devicePixelRatio || 1;
      const displayWidth = Math.floor(window.innerWidth * dpr);
      const displayHeight = Math.floor(window.innerHeight * dpr);

      canvas.width = displayWidth;
      canvas.height = displayHeight;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      ctx.scale(dpr, dpr);
    }, 200);

    debouncedResize();
    window.addEventListener('resize', debouncedResize);

    // Crear partículas
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        dx: (Math.random() - 0.5) * (isIOS ? 0.3 : 0.5), // Movimiento más lento en iOS
        dy: (Math.random() - 0.5) * (isIOS ? 0.3 : 0.5),
        size: Math.random() * (isIOS ? 2 : 3) + 1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    // Función de animación optimizada
    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);

      // Control de FPS
      const elapsed = currentTime - lastTime;
      if (elapsed < fpsInterval) return;
      lastTime = currentTime - (elapsed % fpsInterval);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.x += particle.dx;
        particle.y += particle.dy;

        // Rebote en los bordes con optimización
        if (particle.x < 0) {
          particle.x = 0;
          particle.dx *= -1;
        } else if (particle.x > canvas.width) {
          particle.x = canvas.width;
          particle.dx *= -1;
        }
        
        if (particle.y < 0) {
          particle.y = 0;
          particle.dy *= -1;
        } else if (particle.y > canvas.height) {
          particle.y = canvas.height;
          particle.dy *= -1;
        }

        // Optimización del gradiente para iOS
        if (isIOS) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = particle.color + '80'; // Agregar transparencia
          ctx.fill();
        } else {
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size
          );
          gradient.addColorStop(0, particle.color);
          gradient.addColorStop(1, 'rgba(0,0,0,0)');

          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      });
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', debouncedResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isIOS]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        background: 'linear-gradient(135deg, #0d0c11 0%, #1a1424 100%)',
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden',
        transform: 'translate3d(0,0,0)',
        WebkitTransform: 'translate3d(0,0,0)',
        WebkitPerspective: 1000,
        perspective: 1000,
        WebkitTransformStyle: 'preserve-3d',
        transformStyle: 'preserve-3d'
      }}
    />
  );
};

// Función de debounce para optimizar el resize
function debounce(func: Function, wait: number) {
  let timeout: number;
  return function executedFunction(...args: any[]) {
    const later = () => {
      window.clearTimeout(timeout);
      func(...args);
    };
    window.clearTimeout(timeout);
    timeout = window.setTimeout(later, wait);
  };
}

export default ParticlesBackground;
