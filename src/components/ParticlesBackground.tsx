import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  color: string;
  brightness: number;
  glowPhase: number;
  glowSpeed: number;
  opacity: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  active: boolean;
  trail: Array<{ x: number; y: number }>;
  color: string;
  width: number;
}

interface SpaceObject {
  x: number;
  y: number;
  type: 'planet' | 'ufo';
  size: number;
  rotation: number;
  color: string;
  glowColor: string;
  orbitPhase: number;
  orbitSpeed: number;
  targetX?: number;
  targetY?: number;
  speed?: number;
  acceleration?: number;
  zigzagPhase?: number;
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
    const shootingStars: ShootingStar[] = [];
    const spaceObjects: SpaceObject[] = [];
    const particleCount = isIOS ? 30 : 50;
    const colors = ['#6A11CB', '#2575FC', '#9D50BB', '#6E48AA'];
    const starColors = ['#FFD700', '#FF8C00', '#FF69B4', '#87CEEB', '#FFF'];
    
    let animationFrameId: number;
    let lastTime = 0;
    const fps = isIOS ? 30 : 60;
    const fpsInterval = 1000 / fps;
    const edgeFadeDistance = 50; // Distancia para comenzar el desvanecimiento

    // Crear objetos espaciales
    const createSpaceObject = (): SpaceObject => {
      const type = Math.random() > 0.5 ? 'ufo' : 'planet';
      if (type === 'planet') {
        return {
          x: canvas.width * 0.7,
          y: canvas.height * 0.3,
          type: 'planet',
          size: 50, // Planeta más grande
          rotation: 0,
          color: '#4169E1', // Azul real
          glowColor: '#1E90FF',
          orbitPhase: 0,
          orbitSpeed: 0.0001
        };
      } else {
        return {
          x: -100, // Comienza fuera de la pantalla
          y: Math.random() * canvas.height * 0.7,
          type: 'ufo',
          size: 15,
          rotation: 0,
          color: '#50C878',
          glowColor: '#40E0D0',
          orbitPhase: 0,
          orbitSpeed: 0,
          targetX: canvas.width + 100,
          targetY: Math.random() * canvas.height * 0.7,
          speed: 2 + Math.random() * 3,
          acceleration: 1.002,
          zigzagPhase: 0
        };
      }
    };

    // Inicializar objetos espaciales
    spaceObjects.push(createSpaceObject()); // Un planeta
    spaceObjects.push(createSpaceObject()); // Un OVNI

    // Función mejorada para crear estrellas fugaces
    const createShootingStar = () => {
      const angle = -Math.PI / 6 + (Math.random() * Math.PI / 3); // Ángulo entre -30° y 30°
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height * 0.3), // Comenzar en el tercio superior
        length: 100 + Math.random() * 150, // Estelas más largas
        speed: 15 + Math.random() * 10,
        angle: angle,
        opacity: 0,
        active: true,
        trail: [],
        color: starColors[Math.floor(Math.random() * starColors.length)],
        width: 2 + Math.random() * 2
      };
    };

    // Dibujar planeta con efectos 3D mejorados
    const drawPlanet = (obj: SpaceObject) => {
      const { x, y, size, glowColor, rotation } = obj;
      
      // Efecto de atmósfera exterior
      const atmosphereGradient = ctx.createRadialGradient(
        x, y, size * 0.9,
        x, y, size * 2.2
      );
      atmosphereGradient.addColorStop(0, `${glowColor}15`);
      atmosphereGradient.addColorStop(0.5, `${glowColor}08`);
      atmosphereGradient.addColorStop(1, 'rgba(0,0,0,0)');
      
      ctx.beginPath();
      ctx.fillStyle = atmosphereGradient;
      ctx.arc(x, y, size * 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Planeta con efecto 3D mejorado
      const planetGradient = ctx.createRadialGradient(
        x - size * 0.4, y - size * 0.4, 0,
        x, y, size
      );
      planetGradient.addColorStop(0, '#6495ED'); // Azul más claro
      planetGradient.addColorStop(0.4, '#4169E1'); // Azul real
      planetGradient.addColorStop(0.7, '#283593'); // Azul más oscuro
      planetGradient.addColorStop(1, '#1A237E'); // Azul muy oscuro

      ctx.beginPath();
      ctx.fillStyle = planetGradient;
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();

      // Sistema de anillos mejorado
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation * 0.5);
      
      // Anillos múltiples con diferentes colores y opacidades
      const rings = [
        { scale: 1.8, width: 12, color: '#4169E1', opacity: 0.4 },
        { scale: 1.6, width: 8, color: '#1E90FF', opacity: 0.6 },
        { scale: 1.4, width: 6, color: '#87CEEB', opacity: 0.3 }
      ];

      rings.forEach(ring => {
        ctx.save();
        ctx.scale(1, 0.2); // Perspectiva elíptica
        
        // Gradiente para el anillo
        const ringGradient = ctx.createLinearGradient(-size * ring.scale, 0, size * ring.scale, 0);
        ringGradient.addColorStop(0, 'rgba(0,0,0,0)');
        ringGradient.addColorStop(0.2, `${ring.color}${Math.floor(ring.opacity * 255).toString(16).padStart(2, '0')}`);
        ringGradient.addColorStop(0.5, `${ring.color}FF`);
        ringGradient.addColorStop(0.8, `${ring.color}${Math.floor(ring.opacity * 255).toString(16).padStart(2, '0')}`);
        ringGradient.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.beginPath();
        ctx.strokeStyle = ringGradient;
        ctx.lineWidth = ring.width;
        ctx.ellipse(0, 0, size * ring.scale, size * ring.scale, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
      });
      
      ctx.restore();

      // Detalles de la superficie
      const detailCount = 5;
      for (let i = 0; i < detailCount; i++) {
        const angle = (i / detailCount) * Math.PI * 2 + rotation;
        const distance = size * 0.7;
        const detailX = x + Math.cos(angle) * distance;
        const detailY = y + Math.sin(angle) * distance * 0.2;
        
        const detailGradient = ctx.createRadialGradient(
          detailX, detailY, 0,
          detailX, detailY, size * 0.2
        );
        detailGradient.addColorStop(0, '#283593');
        detailGradient.addColorStop(1, 'rgba(40, 53, 147, 0)');
        
        ctx.beginPath();
        ctx.fillStyle = detailGradient;
        ctx.arc(detailX, detailY, size * 0.2, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // Mejorar visibilidad del OVNI
    const drawUFO = (obj: SpaceObject) => {
      const { x, y, size, color, rotation } = obj;
      
      // Efecto de luz principal debajo del OVNI
      const beamGradient = ctx.createRadialGradient(x, y + size, 0, x, y + size * 3, size * 3);
      beamGradient.addColorStop(0, 'rgba(162, 255, 255, 0.2)');
      beamGradient.addColorStop(1, 'rgba(162, 255, 255, 0)');
      
      ctx.beginPath();
      ctx.fillStyle = beamGradient;
      ctx.arc(x, y + size * 2, size * 3, 0, Math.PI * 2);
      ctx.fill();

      // Cuerpo principal del OVNI
      ctx.beginPath();
      ctx.fillStyle = shadeColor(color, 20);
      ctx.ellipse(x, y, size * 1.8, size * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cúpula superior con efecto de cristal
      const domeGradient = ctx.createRadialGradient(
        x - size * 0.2, y - size * 0.3, 0,
        x, y, size * 0.8
      );
      domeGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      domeGradient.addColorStop(0.4, 'rgba(162, 255, 255, 0.5)');
      domeGradient.addColorStop(1, 'rgba(162, 255, 255, 0.1)');

      ctx.beginPath();
      ctx.fillStyle = domeGradient;
      ctx.arc(x, y - size * 0.2, size * 0.8, Math.PI, 0);
      ctx.fill();

      // Luces parpadeantes mejoradas
      const lightCount = 8;
      for (let i = 0; i < lightCount; i++) {
        const angle = (i / lightCount) * Math.PI * 2 + rotation;
        const lightX = x + Math.cos(angle) * size;
        const lightY = y + Math.sin(angle) * size * 0.3;
        const pulseIntensity = 0.5 + Math.sin(Date.now() * 0.003 + i * 0.5) * 0.5;
        
        const lightGradient = ctx.createRadialGradient(lightX, lightY, 0, lightX, lightY, size * 0.3);
        lightGradient.addColorStop(0, `rgba(255, 255, 255, ${pulseIntensity})`);
        lightGradient.addColorStop(0.5, `rgba(162, 255, 255, ${pulseIntensity * 0.5})`);
        lightGradient.addColorStop(1, 'rgba(162, 255, 255, 0)');
        
        ctx.beginPath();
        ctx.fillStyle = lightGradient;
        ctx.arc(lightX, lightY, size * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Brillo central pulsante
      const centerGlow = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
      const glowIntensity = 0.3 + Math.sin(Date.now() * 0.002) * 0.1;
      centerGlow.addColorStop(0, `rgba(162, 255, 255, ${glowIntensity})`);
      centerGlow.addColorStop(1, 'rgba(162, 255, 255, 0)');
      
      ctx.beginPath();
      ctx.fillStyle = centerGlow;
      ctx.arc(x, y, size * 2, 0, Math.PI * 2);
      ctx.fill();
    };

    // Control mejorado de estrellas fugaces
    const manageShootingStars = () => {
      if (shootingStars.length < 3 && Math.random() < 0.01) { // Aumentada probabilidad
        shootingStars.push(createShootingStar());
      }

      shootingStars.forEach((star, index) => {
        if (star.active) {
          // Actualizar posición
          star.x += Math.cos(star.angle) * star.speed;
          star.y += Math.sin(star.angle) * star.speed;

          // Actualizar opacidad
          if (star.opacity < 1) star.opacity += 0.2;

          // Actualizar trail
          star.trail.unshift({ x: star.x, y: star.y });
          if (star.trail.length > 30) star.trail.pop();

          // Verificar si está fuera del canvas
          if (star.y > canvas.height || star.x < 0 || star.x > canvas.width) {
            star.active = false;
          }

          // Dibujar estela brillante
          const gradient = ctx.createLinearGradient(
            star.x, star.y,
            star.x - star.length * Math.cos(star.angle),
            star.y - star.length * Math.sin(star.angle)
          );
          gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
          gradient.addColorStop(0.1, `${star.color}${Math.floor(star.opacity * 255).toString(16).padStart(2, '0')}`);
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = star.width;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(
            star.x - star.length * Math.cos(star.angle),
            star.y - star.length * Math.sin(star.angle)
          );
          ctx.stroke();

          // Dibujar brillo central
          const centralGlow = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.width * 2
          );
          centralGlow.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
          centralGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.beginPath();
          ctx.fillStyle = centralGlow;
          ctx.arc(star.x, star.y, star.width * 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          shootingStars.splice(index, 1);
        }
      });
    };

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

    // Crear partículas con propiedades de brillo
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        dx: (Math.random() - 0.5) * (isIOS ? 0.3 : 0.5), // Movimiento más lento en iOS
        dy: (Math.random() - 0.5) * (isIOS ? 0.3 : 0.5),
        size: Math.random() * (isIOS ? 2 : 3) + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        brightness: Math.random(),
        glowPhase: Math.random() * Math.PI * 2,
        glowSpeed: 0.02 + Math.random() * 0.03,
        opacity: 1
      });
    }

    const updateParticleBrightness = (particle: Particle) => {
      particle.glowPhase += particle.glowSpeed;
      const sinValue = (Math.sin(particle.glowPhase) + 1) / 2;
      particle.brightness = 0.3 + sinValue * 0.7;
    };

    const calculateEdgeOpacity = (x: number, y: number): number => {
      const distanceFromLeft = x;
      const distanceFromRight = canvas.width - x;
      const distanceFromTop = y;
      const distanceFromBottom = canvas.height - y;

      const minDistance = Math.min(
        distanceFromLeft,
        distanceFromRight,
        distanceFromTop,
        distanceFromBottom
      );

      if (minDistance < edgeFadeDistance) {
        return minDistance / edgeFadeDistance;
      }
      return 1;
    };

    // Función de animación optimizada
    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsed = currentTime - lastTime;
      if (elapsed < fpsInterval) return;
      lastTime = currentTime - (elapsed % fpsInterval);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Actualizar y dibujar objetos espaciales
      spaceObjects.forEach(obj => {
        if (obj.type === 'planet') {
          obj.rotation += 0.002;
          drawPlanet(obj);
        } else if (obj.type === 'ufo') {
          // Movimiento del OVNI
          if (obj.targetX && obj.targetY && obj.speed && obj.acceleration) {
            const dx = obj.targetX - obj.x;
            const dy = obj.targetY - obj.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 5 || obj.x > canvas.width + 100) {
              // Reiniciar OVNI cuando llega a su destino o sale de la pantalla
              obj.x = -100;
              obj.y = Math.random() * canvas.height * 0.7;
              obj.targetX = canvas.width + 100;
              obj.targetY = Math.random() * canvas.height * 0.7;
              obj.speed = 2 + Math.random() * 3;
              obj.zigzagPhase = 0;
            } else {
              // Actualizar posición con movimiento zigzag
              obj.speed *= obj.acceleration;
              obj.zigzagPhase = (obj.zigzagPhase || 0) + 0.1;
              obj.x += (dx / distance) * obj.speed;
              obj.y += (dy / distance) * obj.speed + Math.sin(obj.zigzagPhase) * 2;
              obj.rotation = Math.atan2(dy, dx) + Math.PI / 2;
            }
            drawUFO(obj);
          }
        }
      });

      // Gestionar estrellas fugaces
      manageShootingStars();

      // Dibujar estrellas fugaces
      shootingStars.forEach(star => {
        if (star.active) {
          ctx.beginPath();
          const gradient = ctx.createLinearGradient(
            star.x, star.y,
            star.x - star.length * Math.cos(star.angle),
            star.y - star.length * Math.sin(star.angle)
          );
          gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(
            star.x - star.length * Math.cos(star.angle),
            star.y - star.length * Math.sin(star.angle)
          );
          ctx.stroke();

          // Dibujar el brillo alrededor
          star.trail.forEach((pos, index) => {
            const opacity = (1 - index / star.trail.length) * star.opacity * 0.3;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 1, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.fill();
          });
        }
      });

      particles.forEach(particle => {
        particle.x += particle.dx;
        particle.y += particle.dy;

        // Actualizar brillo y calcular opacidad en los bordes
        updateParticleBrightness(particle);
        particle.opacity = calculateEdgeOpacity(particle.x, particle.y);

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
          const alpha = particle.brightness * particle.opacity * 0.8;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = particle.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
          ctx.fill();
        } else {
          // Renderizado avanzado con dos gradientes para mejor efecto de brillo
          const innerSize = particle.size;
          const outerSize = particle.size * (1 + particle.brightness);
          
          // Gradiente interior brillante
          const innerGradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, innerSize
          );
          innerGradient.addColorStop(0, particle.color);
          innerGradient.addColorStop(1, 'rgba(255,255,255,0)');

          // Gradiente exterior para el brillo
          const outerGradient = ctx.createRadialGradient(
            particle.x, particle.y, innerSize * 0.5,
            particle.x, particle.y, outerSize
          );
          outerGradient.addColorStop(0, `rgba(255,255,255,${0.3 * particle.brightness * particle.opacity})`);
          outerGradient.addColorStop(1, 'rgba(255,255,255,0)');

          // Dibujar el brillo exterior
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, outerSize, 0, Math.PI * 2);
          ctx.fillStyle = outerGradient;
          ctx.fill();

          // Dibujar la partícula interior
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, innerSize, 0, Math.PI * 2);
          ctx.fillStyle = innerGradient;
          ctx.globalAlpha = particle.opacity;
          ctx.fill();
          ctx.globalAlpha = 1;
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

// Función auxiliar para sombrear colores
const shadeColor = (color: string, percent: number): string => {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(Math.min((num >> 16) + amt, 255), 0);
  const G = Math.max(Math.min(((num >> 8) & 0x00FF) + amt, 255), 0);
  const B = Math.max(Math.min((num & 0x0000FF) + amt, 255), 0);
  return '#' + (0x1000000 + (R << 16) + (G << 8) + B).toString(16).slice(1);
};

export default ParticlesBackground;
