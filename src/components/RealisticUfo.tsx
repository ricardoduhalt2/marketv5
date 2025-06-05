import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './RealisticUfo.css';

type UfoFSMState = 'normal' | 'stopping' | 'firingLaser' | 'postLaserMove' | 'hyperjumping' | 'returning' | 'randomMoving' | 'specialMovement';
type LaserShotStep = 'idle' | 'prepareShot' | 'firing' | 'cooldown';

interface TrailPoint {
  x: number;
  y: number;
  opacity: number;
  scale: number;
  scaleX?: number;
  color?: string;
  id: string;
}

const UFO_BASE_WIDTH = 126; // Aumentado 5%: 120 * 1.05 = 126
const UFO_BASE_HEIGHT = 63; // Aumentado 5%: 60 * 1.05 = 63
const UFO_SCALE = 1.26; // Aumentado 5%: 1.2 * 1.05 = 1.26
const NORMAL_SPEED = 1.2;
const HYPERJUMP_SPEED = 8;
const HYPERJUMP_RETURN_DELAY_MS = 2000;

const RealisticUfo: React.FC = () => {
  const [ufoPosition, setUfoPosition] = useState({ x: 100, y: 100 });
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [tilt, setTilt] = useState({ x: 0, z: 0 });
  const [greenHaloIntensity, setGreenHaloIntensity] = useState(1);
  const [engineGlowOpacity, setEngineGlowOpacity] = useState(0.5);

  const [ufoFSMState, setUfoFSMState] = useState<UfoFSMState>('normal');
  const [currentSpeed, setCurrentSpeed] = useState(NORMAL_SPEED);
  const [laserActive, setLaserActive] = useState(false);
  const [laserHeight, setLaserHeight] = useState(0);
  const [randomMoveTarget, setRandomMoveTarget] = useState<{ x: number, y: number } | null>(null);
  const [isStretched, setIsStretched] = useState(false);
  const [shockwaves, setShockwaves] = useState<{x: number, y: number, opacity: number, scale: number, id: string}[]>([]);
  
  const [laserShotStep, setLaserShotStep] = useState<LaserShotStep>('idle');
  const laserFireCountRef = useRef(0);

  const actionTimeoutRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [laserTrail, setLaserTrail] = useState<{x: number, y: number, opacity: number, id: string}[]>([]);
  const [greenEnergyParticles, setGreenEnergyParticles] = useState<{x: number, y: number, opacity: number, id: string}[]>([]);
  const [stoppingParticles, setStoppingParticles] = useState<{x: number, y: number, opacity: number, id: string}[]>([]);

  const clearActionTimeout = useCallback(() => {
    if (actionTimeoutRef.current) {
      clearTimeout(actionTimeoutRef.current);
      actionTimeoutRef.current = null;
    }
  }, []);

  const scheduleAction = useCallback((action: () => void, delay: number) => {
    clearActionTimeout();
    actionTimeoutRef.current = window.setTimeout(action, delay);
  }, [clearActionTimeout]);

  const handleNormalFlight = useCallback(() => {
    setUfoPosition(prev => {
      const newX = prev.x + currentSpeed;
      
      if (newX > window.innerWidth + UFO_BASE_WIDTH) {
        const scaledUfoWidth = UFO_BASE_WIDTH * UFO_SCALE;
        const scaledUfoHeight = UFO_BASE_HEIGHT * UFO_SCALE;
        const marginX = scaledUfoWidth / 2;
        const marginY = scaledUfoHeight / 2;
        const spawnableHeight = Math.max(0, window.innerHeight - scaledUfoHeight);
        
        return { 
          x: -marginX, 
          y: marginY + Math.random() * spawnableHeight 
        };
      }
      
      // Probabilidades de cambio de estado
      const rand = Math.random();
      if (rand < 0.25) { // 25% probabilidad de movimiento especial
        setUfoFSMState('specialMovement');
      } else if (rand < 0.65) { // 40% probabilidad de detenerse y disparar
        setUfoFSMState('stopping');
      } else if (rand < 0.85) { // 20% probabilidad de movimiento aleatorio
        setUfoFSMState('randomMoving');
      } else if (rand < 1.0) { // 15% probabilidad de hyperjump
        setCurrentSpeed(HYPERJUMP_SPEED);
        setIsStretched(true);
        setUfoFSMState('hyperjumping');
      }
      
      return { x: newX, y: prev.y };
    });
  }, [currentSpeed]);

  const handleSpecialMovement = useCallback(() => {
    setUfoPosition(prev => {
      const time = Date.now() * 0.003;
      const amplitude = 30;
      const frequency = 0.8;
      
      const newX = prev.x + currentSpeed;
      const newY = prev.y + Math.sin(time * frequency) * amplitude * 0.1;
      
      setTilt({
        x: Math.sin(time * frequency) * 15,
        z: Math.cos(time * frequency * 0.7) * 8
      });
      
      if (newX > window.innerWidth + UFO_BASE_WIDTH) {
        setTilt({ x: 0, z: 0 });
        setUfoFSMState('normal');
        return { x: -UFO_BASE_WIDTH, y: 100 + Math.random() * (window.innerHeight - 200) };
      }
      
      return { x: newX, y: newY };
    });
  }, [currentSpeed]);

  const handlePostLaserMove = useCallback(() => {
    setUfoPosition(prev => {
      const newX = prev.x + currentSpeed;
      
      if (newX > window.innerWidth + UFO_BASE_WIDTH) {
        setUfoFSMState('normal');
        return { x: -UFO_BASE_WIDTH, y: 100 + Math.random() * (window.innerHeight - 200) };
      }
      
      return { x: newX, y: prev.y };
    });
  }, [currentSpeed]);

  const handleHyperjumping = useCallback(() => {
    setUfoPosition(prev => {
      const newX = prev.x + currentSpeed;
      
      if (newX > window.innerWidth + UFO_BASE_WIDTH || newX < -UFO_BASE_WIDTH * 1.5) { 
        setIsStretched(false);
        setUfoFSMState('returning');
        setUfoPosition({ x: -UFO_BASE_WIDTH * 15, y: -UFO_BASE_HEIGHT * 15 }); // Más lejos para efecto dramático
        
        scheduleAction(() => {
          const scaledUfoWidth = UFO_BASE_WIDTH * UFO_SCALE;
          const scaledUfoHeight = UFO_BASE_HEIGHT * UFO_SCALE;

          const marginX = scaledUfoWidth / 2;
          const marginY = scaledUfoHeight / 2;

          const spawnableWidth = Math.max(0, window.innerWidth - scaledUfoWidth);
          const spawnableHeight = Math.max(0, window.innerHeight - scaledUfoHeight);

          // Entrada más espectacular desde diferentes direcciones
          const entryDirection = Math.random();
          let enterX, enterY;
          
          if (entryDirection < 0.25) { // Desde arriba
            enterX = marginX + Math.random() * spawnableWidth;
            enterY = -scaledUfoHeight;
          } else if (entryDirection < 0.5) { // Desde abajo
            enterX = marginX + Math.random() * spawnableWidth;
            enterY = window.innerHeight + scaledUfoHeight;
          } else if (entryDirection < 0.75) { // Desde la izquierda
            enterX = -scaledUfoWidth;
            enterY = marginY + Math.random() * spawnableHeight;
          } else { // Desde la derecha
            enterX = window.innerWidth + scaledUfoWidth;
            enterY = marginY + Math.random() * spawnableHeight;
          }
          
          setUfoPosition({ x: enterX, y: enterY });
          setCurrentSpeed(NORMAL_SPEED); 
          setUfoFSMState('normal'); 
          setGreenHaloIntensity(1);
        }, HYPERJUMP_RETURN_DELAY_MS);
      }
      setTilt({ x: 0, z: 0 });
      return { x: newX, y: prev.y }; 
    });
  }, [scheduleAction, currentSpeed]); 

  const handleRandomMoving = useCallback(() => {
    const speedForRandomMove = NORMAL_SPEED * 2.5; 
    if (!randomMoveTarget) { 
      const scaledUfoWidth = UFO_BASE_WIDTH * UFO_SCALE;
      const scaledUfoHeight = UFO_BASE_HEIGHT * UFO_SCALE;
      const marginX = scaledUfoWidth / 2;
      const marginY = scaledUfoHeight / 2;
      const spawnableWidth = Math.max(0, window.innerWidth - scaledUfoWidth);
      const spawnableHeight = Math.max(0, window.innerHeight - scaledUfoHeight);

      setRandomMoveTarget({ 
        x: marginX + Math.random() * spawnableWidth, 
        y: marginY + Math.random() * spawnableHeight
      });
      return;
    }

    setUfoPosition(prev => {
      const dx = randomMoveTarget.x - prev.x;
      const dy = randomMoveTarget.y - prev.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < speedForRandomMove * 1.5) { 
        setRandomMoveTarget(null);
        return prev;
      }

      const moveX = (dx / distance) * speedForRandomMove;
      const moveY = (dy / distance) * speedForRandomMove;

      setTilt({
        x: moveY * 2,
        z: moveX * 1.5
      });

      return { x: prev.x + moveX, y: prev.y + moveY };
    });
  }, [randomMoveTarget]);

  const handleFiringLaser = useCallback(() => {
    if (laserActive) {
      const visualUfoBottomY = ufoPosition.y + (UFO_BASE_HEIGHT * UFO_SCALE);
      setLaserHeight(window.innerHeight - visualUfoBottomY);
      
      // Agregar punto a la estela del láser - CORREGIDO PARA ALINEACIÓN PERFECTA
      setLaserTrail(prev => [
        ...prev.slice(-5), // Mantener solo los últimos 5 puntos para la estela
        { 
          x: ufoPosition.x, // Centrado con la nave
          y: visualUfoBottomY,
          opacity: 1,
          id: `laser-trail-${Date.now()}`
        }
      ]);

      // 🌟 CREAR ONDAS DE CHOQUE AL DISPARAR
      if (Math.random() < 0.3) { // 30% probabilidad por frame
        setShockwaves(prev => [
          ...prev.slice(-3), // Mantener solo las últimas 3 ondas
          {
            x: ufoPosition.x, // Centrado con la nave
            y: visualUfoBottomY,
            opacity: 1,
            scale: 0.1,
            id: `shockwave-${Date.now()}`
          }
        ]);
      }
    } else {
      setLaserHeight(0);
      // Desvanecer gradualmente la estela
      const fadeInterval = setInterval(() => {
        setLaserTrail(prev => {
          const updated = prev.map(point => ({
            ...point,
            opacity: point.opacity - 0.02
          }));
          return updated.filter(p => p.opacity > 0);
        });
      }, 30);
      
      setTimeout(() => {
        clearInterval(fadeInterval);
        setLaserTrail([]);
      }, 1000);
    }
  }, [laserActive, ufoPosition.x, ufoPosition.y]);

  // Laser firing effect
  useEffect(() => {
    if (laserShotStep === 'prepareShot') {
      scheduleAction(() => {
        setLaserShotStep('firing');
        setLaserActive(true);
        setGreenHaloIntensity(3.5); // Intensidad muy alta durante el disparo
      }, 800); // Tiempo de preparación más largo
    } else if (laserShotStep === 'firing') {
      scheduleAction(() => {
        setLaserActive(false);
        setLaserShotStep('cooldown');
        setGreenHaloIntensity(2); // Intensidad media después del disparo
      }, 1200); // Duración del disparo más larga
    } else if (laserShotStep === 'cooldown') {
      laserFireCountRef.current += 1;
      
      if (laserFireCountRef.current < 4) { // Disparar 4 veces en lugar de 3
        scheduleAction(() => {
          setLaserShotStep('prepareShot');
        }, 600); // Tiempo entre disparos más corto
      } else {
        scheduleAction(() => {
          setLaserShotStep('idle');
          setCurrentSpeed(NORMAL_SPEED);
          setUfoFSMState('postLaserMove');
          setGreenHaloIntensity(1); // Volver a intensidad normal
        }, 500);
      }
    }
  }, [laserShotStep, scheduleAction]);

  // Green halo intensity effect based on state
  useEffect(() => {
    switch (ufoFSMState) {
      case 'normal':
        setGreenHaloIntensity(1); // Intensidad normal
        break;
      case 'stopping':
        setGreenHaloIntensity(1.3); // Ligeramente más intenso al detenerse
        break;
      case 'firingLaser':
        // La intensidad se controla en el efecto del láser
        break;
      case 'hyperjumping':
        setGreenHaloIntensity(2.5); // Intensidad muy alta durante hyperjump
        break;
      case 'randomMoving':
        setGreenHaloIntensity(1.8); // Intensidad alta durante movimiento aleatorio
        break;
      case 'specialMovement':
        setGreenHaloIntensity(1.5); // Intensidad moderada durante movimiento especial
        break;
    }
  }, [ufoFSMState]);

  const updateUfoAndWorld = useCallback(() => {
    switch (ufoFSMState) {
      case 'normal':
        handleNormalFlight();
        break;
      case 'stopping':
        const newStoppingSpeed = Math.max(0, currentSpeed - 0.05);
        if (newStoppingSpeed <= 0) {
          setCurrentSpeed(0); 
          laserFireCountRef.current = 0; 
          setUfoFSMState('firingLaser'); 
          setLaserShotStep('prepareShot'); 
        } else {
          setCurrentSpeed(newStoppingSpeed);
          setUfoPosition(prev => ({ x: prev.x + newStoppingSpeed, y: prev.y })); 
        }
        break;
      case 'firingLaser':
        handleFiringLaser(); 
        break;
      case 'postLaserMove':
        handlePostLaserMove();
        break;
      case 'hyperjumping':
        handleHyperjumping();
        break;
      case 'returning':
        break; 
      case 'randomMoving':
        handleRandomMoving();
        break;
      case 'specialMovement':
        handleSpecialMovement();
        break;
    }

    setEngineGlowOpacity(0.5 + Math.random() * 0.5);

    if (ufoFSMState !== 'returning') {
        setTrail(prevTrail => {
        const trailOriginX = ufoPosition.x; 
        const trailOriginY = ufoPosition.y;

        const newTrailPoint: TrailPoint = {
            x: trailOriginX, 
            y: trailOriginY,
            opacity: 1,
            scale: 1,
            scaleX: ufoFSMState === 'hyperjumping' ? 3.5 : 1, 
            color: ufoFSMState === 'hyperjumping' ? 'rgba(200, 255, 255, 0.9)' : undefined, 
            id: `trail-${Date.now()}-${Math.random()}`
        };
        let updatedTrail = [newTrailPoint, ...prevTrail];
        
        const maxTrailLength = ufoFSMState === 'hyperjumping' ? 90 : 45;
        return updatedTrail.slice(0, maxTrailLength).map((point, index) => ({
            ...point,
            opacity: Math.max(0, 1 - (index / maxTrailLength) * (ufoFSMState === 'hyperjumping' ? 0.6 : 1)),
            scale: Math.max(0, 1 - (index / maxTrailLength) * (ufoFSMState === 'hyperjumping' ? 0.4 : 0.8)),
        }));
        });
    }

    // 🌟 GENERAR Y ANIMAR PARTÍCULAS DE ENERGÍA VERDE
    if (ufoFSMState !== 'returning' && greenHaloIntensity > 1.2) {
      setGreenEnergyParticles(prevParticles => {
        // Generar nuevas partículas alrededor del UFO
        const newParticles = [];
        const particleCount = Math.floor(greenHaloIntensity * 2); // Más partículas con mayor intensidad
        
        for (let i = 0; i < particleCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const distance = 30 + Math.random() * 50; // Distancia del UFO
          const offsetX = Math.cos(angle) * distance;
          const offsetY = Math.sin(angle) * distance;
          
          newParticles.push({
            x: ufoPosition.x + offsetX,
            y: ufoPosition.y + offsetY,
            opacity: 1,
            id: `green-particle-${Date.now()}-${i}`
          });
        }
        
        // Combinar con partículas existentes y limitar cantidad
        const allParticles = [...newParticles, ...prevParticles];
        return allParticles.slice(0, 20); // Máximo 20 partículas
      });
    }

    // 🌟 GENERAR PARTÍCULAS ESPECIALES CUANDO SE DETIENE
    if (ufoFSMState === 'stopping' || ufoFSMState === 'firingLaser') {
      setStoppingParticles(prevParticles => {
        // Generar nuevas partículas concentradas alrededor del UFO
        const newParticles = [];
        const particleCount = ufoFSMState === 'firingLaser' ? 8 : 5; // Más partículas al disparar
        
        for (let i = 0; i < particleCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const distance = 20 + Math.random() * 40; // Más cerca del UFO
          const offsetX = Math.cos(angle) * distance;
          const offsetY = Math.sin(angle) * distance;
          
          newParticles.push({
            x: ufoPosition.x + offsetX,
            y: ufoPosition.y + offsetY,
            opacity: 1,
            id: `stopping-particle-${Date.now()}-${i}`
          });
        }
        
        // Combinar con partículas existentes y limitar cantidad
        const allParticles = [...newParticles, ...prevParticles];
        return allParticles.slice(0, 15); // Máximo 15 partículas especiales
      });
    } else {
      // Limpiar partículas de detención cuando no está en esos estados
      setStoppingParticles([]);
    }

    // Desvanecer partículas de energía verde
    setGreenEnergyParticles(prevParticles => 
      prevParticles.map(particle => ({
        ...particle,
        opacity: particle.opacity - 0.02
      })).filter(particle => particle.opacity > 0)
    );

    // Desvanecer partículas de detención
    setStoppingParticles(prevParticles => 
      prevParticles.map(particle => ({
        ...particle,
        opacity: particle.opacity - 0.03
      })).filter(particle => particle.opacity > 0)
    );

    // 🌟 ANIMAR ONDAS DE CHOQUE
    setShockwaves(prevShockwaves => 
      prevShockwaves.map(wave => ({
        ...wave,
        opacity: wave.opacity - 0.03,
        scale: wave.scale + 0.15
      })).filter(wave => wave.opacity > 0 && wave.scale < 5)
    );

    animationFrameRef.current = requestAnimationFrame(updateUfoAndWorld);
  }, [
    ufoFSMState, currentSpeed, ufoPosition, 
    handleNormalFlight, handleFiringLaser, handlePostLaserMove, 
    handleHyperjumping, handleRandomMoving, handleSpecialMovement,
    greenHaloIntensity
  ]);
  
  // Main animation loop effect
  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(updateUfoAndWorld);
    return () => { // This cleanup runs when component unmounts OR when dependencies change
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      clearActionTimeout();
    };
  }, [updateUfoAndWorld, clearActionTimeout]);

  const engineLights = useMemo(() => [...Array(6)].map((_, i) => ({
    id: i,
    intensity: 0.3 + Math.random() * 0.7,
    delay: i * 0.11
  })), []);

  return (
    <div className="ufo-viewport">
      <div className="ufo-trail">
        {trail.map((point, index) => (
          <div
            key={`${point.id}-${index}`}
            className="trail-point"
            style={{
              left: `${point.x}px`,
              top: `${point.y}px`,
              opacity: point.opacity,
              transform: `scale(${point.scale})`,
              backgroundColor: point.color || 'rgba(100, 200, 255, 0.6)'
            }}
          />
        ))}
        {/* Estela del láser */}
        {laserTrail.map((point, index) => (
          <div
            key={`laser-trail-${index}`}
            className="laser-trail-point"
            style={{
              left: `${point.x}px`,
              top: `${point.y}px`,
              opacity: point.opacity * 0.7,
            }}
          />
        ))}
        {/* 🌟 PARTÍCULAS DE ENERGÍA VERDE */}
        {greenEnergyParticles.map((particle, index) => (
          <div
            key={`green-energy-${index}`}
            className="green-energy-particle"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              opacity: particle.opacity,
            }}
          />
        ))}
        {/* 🌟 PARTÍCULAS ESPECIALES CUANDO SE DETIENE */}
        {stoppingParticles.map((particle, index) => (
          <div
            key={`stopping-energy-${index}`}
            className="stopping-energy-particle"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              opacity: particle.opacity,
            }}
          />
        ))}
        {/* 🌟 ONDAS DE CHOQUE DEL LÁSER */}
        {shockwaves.map((wave, index) => (
          <div
            key={`shockwave-${index}`}
            className="laser-shockwave"
            style={{
              left: `${wave.x}px`,
              top: `${wave.y}px`,
              opacity: wave.opacity,
              transform: `translate(-50%, -50%) scale(${wave.scale})`,
            }}
          />
        ))}
      </div>
      <div
        className="ufo-perspective-group" 
        style={{
          transform: `translate(${ufoPosition.x - UFO_BASE_WIDTH / 2}px, ${ufoPosition.y - UFO_BASE_HEIGHT / 2}px)`,
        }}
      >
        <div 
          className="ufo-scaler-wrapper"
          style={{
            transform: `scale(${UFO_SCALE}) ${isStretched ? 'scaleX(2.5)' : ''}`,
          }}
        >
          <div 
            className="ufo-tilt-wrapper"
            style={{
              transform: `rotateX(${tilt.x}deg) rotateZ(${tilt.z}deg)`,
            }}
          >
            <div className="ufo-main-body">
              <div className="ufo-top-dome">
                <div 
                  className="ufo-green-halo" 
                  style={{ 
                    opacity: greenHaloIntensity * 0.4,
                    transform: `scale(${0.8 + greenHaloIntensity * 0.3})`,
                    filter: `blur(${2 + greenHaloIntensity * 2}px)`
                  }} 
                />
                {/* HALO ESPECIAL CUANDO SE DETIENE */}
                {(ufoFSMState === 'stopping' || ufoFSMState === 'firingLaser') && (
                  <div className="stopping-energy-halo" />
                )}
                <div className="ufo-dome-surface">
                  <div className="ufo-dome-highlight" />
                  <div className="ufo-dome-reflection" />
                </div>
                {/* VENTANAS DE LA CÚPULA */}
                <div className="ufo-dome-window"></div>
                <div className="ufo-dome-window"></div>
                <div className="ufo-dome-window"></div>
              </div>
              <div className="ufo-body-connector" />
              <div className="ufo-dome-shadow" />
              {/* Back Dome - Flipped 180 degrees */}
              <div className="ufo-dome-back" style={{ transform: 'rotateY(180deg) translateZ(-10px)' }}>
                <div className="ufo-dome-surface">
                  <div className="ufo-dome-highlight" />
                  <div className="ufo-dome-reflection" />
                </div>
                <div className="ufo-dome-window"></div>
                <div className="ufo-dome-window"></div>
                <div className="ufo-dome-window"></div>
              </div>
              <div className="ufo-mid-section">
                <div className="ufo-metallic-band" />
                <div className="ufo-running-light-strip">
                  {[
                    { color1: '255, 100, 100', color2: '255, 50, 50' },   // Rojo
                    { color1: '100, 255, 100', color2: '50, 200, 50' },   // Verde
                    { color1: '100, 100, 255', color2: '50, 50, 255' },   // Azul
                    { color1: '255, 255, 100', color2: '255, 200, 50' },  // Amarillo
                    { color1: '255, 100, 255', color2: '200, 50, 200' },  // Magenta
                    { color1: '100, 255, 255', color2: '50, 200, 200' },  // Cian
                    { color1: '255, 150, 50', color2: '255, 100, 0' },    // Naranja
                    { color1: '150, 50, 255', color2: '100, 0, 200' }     // Púrpura
                  ].map((colors, i) => ({
                    ...colors,
                    id: `runlight-${i}`,
                    delay: i * 0.22
                  })).map(light => (
                    <div
                      key={light.id}
                      className="ufo-running-light"
                      style={{
                        '--color1': light.color1,
                        '--color2': light.color2,
                        animationDelay: `${light.delay}s`
                      } as React.CSSProperties}
                    />
                  ))}
                </div>
              </div>
              <div className="ufo-underside">
                  <div className="ufo-engine-glow-cone" style={{ opacity: engineGlowOpacity }} />
                  <div className="ufo-thruster-ports">
                    {engineLights.map((light) => (
                      <div
                        key={light.id}
                        className="ufo-thruster-port"
                        style={{
                          opacity: light.intensity,
                          animationDelay: `${light.delay}s`,
                          boxShadow: `0 0 ${8 + light.intensity * 15}px ${2 + light.intensity * 4}px rgba(0, 220, 255, ${0.25 + light.intensity * 0.5})`
                        }}
                      />
                    ))}
                  </div>
              </div>
              {/* PUERTO DEL LÁSER */}
              <div className="ufo-laser-port" />
            </div>
          </div>
        </div> 
        
        {(laserActive || laserShotStep !== 'idle' || ufoFSMState === 'firingLaser') && (
          <div
            className="ufo-laser-beam"
            style={{
              height: `${laserHeight}px`,
              opacity: laserActive ? 1 : 0,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default RealisticUfo;