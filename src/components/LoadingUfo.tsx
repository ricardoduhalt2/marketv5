import React, { useState, useEffect, useCallback, useRef } from 'react';
import './LoadingUfo.css';

type UfoState = 'floating' | 'moving' | 'firingLaser' | 'returning';

interface LoadingUfoProps {
  className?: string;
}

const LoadingUfo: React.FC<LoadingUfoProps> = ({ className = '' }) => {
  // Estados básicos del UFO
  const [greenHaloIntensity, setGreenHaloIntensity] = useState(1);
  const [engineGlowOpacity, setEngineGlowOpacity] = useState(0.5);
  const [greenEnergyParticles, setGreenEnergyParticles] = useState<{x: number, y: number, opacity: number, id: string}[]>([]);
  
  // Estados de movimiento y láser
  const [ufoState, setUfoState] = useState<UfoState>('floating');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, z: 0 });
  const [laserActive, setLaserActive] = useState(false);
  const [laserHeight, setLaserHeight] = useState(0);
  
  const actionTimeoutRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particleIntervalRef = useRef<number | null>(null);

  // Luces del motor - memoized to prevent recreation
  const engineLights = React.useMemo(() => [
    { id: 'engine1', intensity: 0.8, delay: 0 },
    { id: 'engine2', intensity: 0.6, delay: 0.3 },
    { id: 'engine3', intensity: 0.9, delay: 0.6 },
    { id: 'engine4', intensity: 0.7, delay: 0.9 },
  ], []);

  // Limpiar timeouts
  const clearActionTimeout = useCallback(() => {
    if (actionTimeoutRef.current) {
      clearTimeout(actionTimeoutRef.current);
      actionTimeoutRef.current = null;
    }
  }, []);

  // Generar nuevo objetivo de movimiento - PANTALLA COMPLETA
  const generateMoveTarget = useCallback(() => {
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    const ufoSize = 80; // Tamaño del UFO
    const margin = ufoSize / 2;
    
    // Calcular límites para que el UFO no se salga de la pantalla
    const minX = margin - containerWidth / 2;
    const maxX = containerWidth / 2 - margin;
    const minY = margin - containerHeight / 2;
    const maxY = containerHeight / 2 - margin;
    
    return {
      x: minX + Math.random() * (maxX - minX),
      y: minY + Math.random() * (maxY - minY)
    };
  }, []);

  // Iniciar secuencia de láser - MÁS RÁPIDA
  const startLaserSequence = useCallback(() => {
    setUfoState('firingLaser');
    setLaserActive(true);
    
    // Animación del láser creciendo - MÁS RÁPIDA
    let height = 0;
    const laserGrowth = () => {
      height += 10; // Aumentado para más velocidad
      setLaserHeight(height);
      if (height < 100) { // Reducido para menor duración
        requestAnimationFrame(laserGrowth);
      } else {
        // Mantener láser por menos tiempo
        setTimeout(() => {
          // Láser desapareciendo - MÁS RÁPIDO
          const laserShrink = () => {
            height -= 15; // Aumentado para más velocidad
            setLaserHeight(Math.max(0, height));
            if (height > 0) {
              requestAnimationFrame(laserShrink);
            } else {
              setLaserActive(false);
              setUfoState('returning');
              // Volver a flotación más rápido
              setTimeout(() => {
                setUfoState('floating');
              }, 300); // Reducido aún más
            }
          };
          laserShrink();
        }, 500); // Reducido de 800 a 500
      }
    };
    laserGrowth();
  }, []);

  // Iniciar movimiento - MÁS RÁPIDO
  const startMovement = useCallback(() => {
    const target = generateMoveTarget();
    setUfoState('moving');
    
    // Calcular tilt basado en dirección
    const tiltX = target.x * 0.03; // Reducido para menos inclinación
    const tiltZ = target.y * 0.02; // Reducido para menos inclinación
    setTilt({ x: tiltX, z: tiltZ });
    
    // Simular llegada al destino - MÁS RÁPIDO
    setTimeout(() => {
      setPosition(target);
      setTilt({ x: 0, z: 0 });
      
      // Decidir próxima acción más rápido
      const nextAction = Math.random();
      if (nextAction < 0.5) {
        // 50% probabilidad de láser
        setTimeout(() => startLaserSequence(), 100); // Reducido aún más
      } else {
        // 50% volver a flotación
        setUfoState('floating');
      }
    }, 800); // Reducido de 1500 a 800
  }, [generateMoveTarget, startLaserSequence]);

  // Ciclo principal de comportamiento - MÁS ACTIVO
  useEffect(() => {
    const behaviorCycle = () => {
      if (ufoState === 'floating') {
        // Después de flotar, decidir próxima acción más rápido
        const action = Math.random();
        if (action < 0.7) {
          // 70% probabilidad de moverse
          actionTimeoutRef.current = window.setTimeout(() => startMovement(), 500 + Math.random() * 800); // Reducido significativamente
        } else {
          // 30% probabilidad de láser directo
          actionTimeoutRef.current = window.setTimeout(() => startLaserSequence(), 200 + Math.random() * 600); // Reducido significativamente
        }
      }
    };

    const timeout = setTimeout(behaviorCycle, 300); // Reducido de 500 a 300
    return () => clearTimeout(timeout);
  }, [ufoState, startMovement, startLaserSequence]);

  // Animación del halo de energía
  useEffect(() => {
    const animateHalo = () => {
      const time = Date.now() * 0.002; // Aumentada la velocidad
      const intensity = 0.6 + Math.sin(time * 2) * 0.4;
      setGreenHaloIntensity(intensity);
      
      const glowOpacity = 0.3 + Math.sin(time * 1.5) * 0.3;
      setEngineGlowOpacity(glowOpacity);
      
      animationFrameRef.current = requestAnimationFrame(animateHalo);
    };
    
    animateHalo();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Generar partículas de energía - optimizado para mejor rendimiento
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      const time = Date.now() * 0.003; // Aumentada la velocidad
      
      for (let i = 0; i < 4; i++) { // Reducido de 6 a 4 partículas
        const angle = (i / 4) * Math.PI * 2 + time;
        const radius = 30 + Math.sin(time * 0.7 + i) * 8; // Ajustado para mejor rendimiento
        newParticles.push({
          id: `particle-${i}`,
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          opacity: 0.3 + Math.sin(time + i) * 0.3
        });
      }
      setGreenEnergyParticles(newParticles);
    };

    // Usar un intervalo más largo para menos cálculos
    particleIntervalRef.current = window.setInterval(generateParticles, 150);
    return () => {
      if (particleIntervalRef.current) {
        clearInterval(particleIntervalRef.current);
      }
    };
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      clearActionTimeout();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (particleIntervalRef.current) {
        clearInterval(particleIntervalRef.current);
      }
    };
  }, [clearActionTimeout]);

  return (
    <div className={`loading-ufo-container ${className}`}>
      {/* Partículas de energía verde */}
      {greenEnergyParticles.map((particle) => (
        <div
          key={particle.id}
          className="loading-green-energy-particle"
          style={{
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) translate(${particle.x}px, ${particle.y}px)`,
            opacity: particle.opacity
          }}
        />
      ))}

      {/* Rayo láser */}
      {laserActive && (
        <div 
          className="loading-ufo-laser-beam"
          style={{
            height: `${laserHeight}px`,
            opacity: laserHeight > 0 ? 1 : 0
          }}
        />
      )}

      {/* UFO Principal */}
      <div 
        className="loading-ufo-main"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) rotateX(${tilt.x}deg) rotateZ(${tilt.z}deg)`,
          transition: ufoState === 'moving' ? 'transform 1s ease-in-out' : 'transform 0.2s ease-out' // Acelerado
        }}
      >
        {/* Halo de energía verde etérea - MISMO EFECTO QUE EL MAIN UFO */}
        <div 
          className="loading-ufo-green-halo" 
          style={{ 
            opacity: greenHaloIntensity * (ufoState === 'firingLaser' ? 0.8 : 0.4),
            transform: `scale(${0.8 + greenHaloIntensity * (ufoState === 'firingLaser' ? 0.5 : 0.3)})`,
            filter: `blur(${2 + greenHaloIntensity * (ufoState === 'firingLaser' ? 4 : 2)}px)`
          }} 
        />

        {/* Cúpula del UFO */}
        <div className="loading-ufo-dome">
          <div className="loading-ufo-dome-surface">
            <div className="loading-ufo-dome-highlight" />
            <div className="loading-ufo-dome-reflection" />
          </div>
          {/* Ventanas de la cúpula */}
          <div className="loading-ufo-dome-window"></div>
          <div className="loading-ufo-dome-window"></div>
          <div className="loading-ufo-dome-window"></div>
        </div>

        {/* Conector del cuerpo */}
        <div className="loading-ufo-body-connector" />
        
        {/* Sombra de la cúpula */}
        <div className="loading-ufo-dome-shadow" />
        
        {/* Sección media */}
        <div className="loading-ufo-mid-section">
          <div className="loading-ufo-metallic-band" />
          <div className="loading-ufo-running-light-strip">
            {[...Array(4)].map((_, i) => ( // Reducido de 6 a 4 luces
              <div
                key={`runlight-${i}`}
                className="loading-ufo-running-light"
                style={{ animationDelay: `${i * 0.2}s` }} // Acelerado
              />
            ))}
          </div>
        </div>

        {/* Parte inferior */}
        <div className="loading-ufo-underside">
          <div 
            className="loading-ufo-engine-glow-cone" 
            style={{ 
              opacity: engineGlowOpacity * (ufoState === 'moving' ? 1.5 : 1)
            }} 
          />
          <div className="loading-ufo-thruster-ports">
            {engineLights.map((light) => (
              <div
                key={light.id}
                className="loading-ufo-thruster-port"
                style={{
                  opacity: light.intensity * (ufoState === 'moving' ? 1.3 : 1),
                  animationDelay: `${light.delay}s`,
                  boxShadow: `0 0 ${4 + light.intensity * (ufoState === 'moving' ? 10 : 7)}px ${1 + light.intensity * (ufoState === 'moving' ? 3 : 2)}px rgba(0, 220, 255, ${0.2 + light.intensity * (ufoState === 'moving' ? 0.5 : 0.3)})`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingUfo;