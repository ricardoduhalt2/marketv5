import React, { useEffect, useRef } from 'react';

interface GlowingParticle {
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  color: string;
  alpha: number;
}

const GlowingParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<GlowingParticle[]>([]);
  const animationFrameId = useRef<number | null>(null);
  const lastTime = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Configuración de partículas
    const particleCount = 20; // Menos partículas para evitar saturación
    const colors = ['#6A11CB', '#2575FC', '#00C6FB', '#20E3B2']; // Menos colores para más consistencia
    
    // Inicializar partículas
    const initParticles = () => {
      const particles: GlowingParticle[] = [];
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          dx: (Math.random() - 0.5) * 0.8, // Movimiento más lento
          dy: (Math.random() - 0.5) * 0.8, // Movimiento más lento
          size: 0.8 + Math.random() * 0.5, // Tamaño más pequeño y consistente
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 0.4 + Math.random() * 0.3 // Menos opacidad para evitar manchas
        });
      }

      return particles;
    };

    // Función para manejar el redimensionamiento
    const handleResize = () => {
      if (!canvas) return;

      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    // Función de animación
    const animate = (timestamp: number) => {
      if (!lastTime.current) lastTime.current = timestamp;
      const deltaTime = timestamp - lastTime.current;
      lastTime.current = timestamp;

      // Control de FPS (30 FPS)
      if (deltaTime < 33 && deltaTime > 0) {
        animationFrameId.current = requestAnimationFrame(animate);
        return;
      }

      // Limpiar canvas
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Actualizar y dibujar partículas
      particlesRef.current.forEach(particle => {
        // Actualizar posición
        particle.x += particle.dx;
        particle.y += particle.dy;

        // Rebotar en los bordes
        if (particle.x < 0 || particle.x > canvas.width) particle.dx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.dy *= -1;

        // Asegurar que las partículas no salgan de los límites
        particle.x = Math.max(0, Math.min(particle.x, canvas.width));
        particle.y = Math.max(0, Math.min(particle.y, canvas.height));

        // Dibujar partícula con círculo sólido y borde brillante
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 1.5
        );
        
        // Gradiente más definido
        gradient.addColorStop(0, `${particle.color}ff`);
        gradient.addColorStop(0.8, `${particle.color}80`);
        gradient.addColorStop(1, `${particle.color}00`);

        // Círculo interior sólido
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        // Aura exterior con gradiente
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    // Inicialización
    handleResize();
    particlesRef.current = initParticles();
    lastTime.current = performance.now();
    // Usar una función de envoltura para asegurar el tipado correcto
    const animateWrapper = (timestamp: number) => animate(timestamp);
    animationFrameId.current = requestAnimationFrame(animateWrapper);

    // Manejar redimensionamiento
    const handleWindowResize = () => {
      handleResize();
      // Reubicar partículas al redimensionar
      if (particlesRef.current.length > 0) {
        particlesRef.current = particlesRef.current.map(p => ({
          ...p,
          x: Math.random() * (window.innerWidth * (window.devicePixelRatio || 1)),
          y: Math.random() * (window.innerHeight * (window.devicePixelRatio || 1))
        }));
      }
    };

    window.addEventListener('resize', handleWindowResize);

    // Limpieza
    return () => {
      window.removeEventListener('resize', handleWindowResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        opacity: 0.6, // Opacidad ligeramente reducida
        mixBlendMode: 'screen' // Mejor mezcla con el fondo
      }}
    />
  );
};

export default GlowingParticles;
