
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import './RealisticUfo.css'; // Import the new CSS file

interface TrailPoint {
  x: number;
  y: number;
  opacity: number;
  scale: number;
  scaleX?: number; // For hyperjump stretching
  color?: string; // For hyperjump color change
  id: string;
}

const UFO_BASE_WIDTH = 200; // Original width before scaling
const UFO_BASE_HEIGHT = 60; // Original height before scaling
const UFO_SCALE = 0.595; // Reducido un 15% desde 0.7

const NORMAL_SPEED = 1.8;
const HYPERJUMP_SPEED = 60;
const SHORTER_LASER_DURATION_MS = 700; 
const MAX_LASER_SHOTS = 2; 
const LASER_REFIRE_DELAY_MS = 300; 
const POST_LASER_MOVE_DURATION_MS = 1500; // Increased for longer advance
const POST_LASER_MOVE_SPEED = NORMAL_SPEED * 0.7; 
const HYPERJUMP_RETURN_DELAY_MS = 2500;
const RANDOM_MOVE_DURATION_MS = 15000;
const EVENT_SEQUENCE_TRIGGER_MS = 12000;

type UfoFSMState = 'normal' | 'stopping' | 'firingLaser' | 'postLaserMove' | 'hyperjumping' | 'returning' | 'randomMoving';
type LaserShotStep = 'idle' | 'prepareShot' | 'firingActive' | 'shotCooldown';

const RealisticUfo = (): React.ReactElement => {
  const [ufoPosition, setUfoPosition] = useState({ x: -UFO_BASE_WIDTH * 1.5 * UFO_SCALE, y: 150 });
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [tilt, setTilt] = useState({ x: 0, z: 0 });
  const [engineGlowOpacity, setEngineGlowOpacity] = useState(0.7);

  const [ufoFSMState, setUfoFSMState] = useState<UfoFSMState>('normal');
  const [currentSpeed, setCurrentSpeed] = useState(NORMAL_SPEED);
  const [laserActive, setLaserActive] = useState(false);
  const [laserHeight, setLaserHeight] = useState(0);
  const [randomMoveTarget, setRandomMoveTarget] = useState<{ x: number, y: number } | null>(null);
  const [isStretched, setIsStretched] = useState(false);
  
  const [laserShotStep, setLaserShotStep] = useState<LaserShotStep>('idle');
  const laserFireCountRef = useRef(0);

  const actionTimeoutRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const clearActionTimeout = useCallback(() => {
    if (actionTimeoutRef.current) {
      clearTimeout(actionTimeoutRef.current);
      actionTimeoutRef.current = null;
    }
  }, []);
  
  const scheduleAction = useCallback((callback: () => void, delay: number) => {
    clearActionTimeout(); // Clear any existing pending action before scheduling a new one
    actionTimeoutRef.current = window.setTimeout(callback, delay);
  }, [clearActionTimeout]);

  // Effect to manage the laser firing sub-sequence
  useEffect(() => {
    if (ufoFSMState !== 'firingLaser') {
      if (laserActive) setLaserActive(false);
      if (laserHeight > 0) setLaserHeight(0);
      if (laserShotStep !== 'idle') setLaserShotStep('idle');
      return;
    }

    switch (laserShotStep) {
      case 'prepareShot':
        if (laserFireCountRef.current < MAX_LASER_SHOTS) {
          setLaserActive(true);
          scheduleAction(() => setLaserShotStep('firingActive'), 50); 
        } else {
          // All shots fired, transition out of laser sequence
          setLaserShotStep('idle'); 
          setUfoFSMState('postLaserMove');
          setCurrentSpeed(POST_LASER_MOVE_SPEED);
          scheduleAction(() => {
            setUfoFSMState('hyperjumping');
            setCurrentSpeed(HYPERJUMP_SPEED);
            setIsStretched(true);
          }, POST_LASER_MOVE_DURATION_MS);
        }
        break;

      case 'firingActive':
        scheduleAction(() => setLaserShotStep('shotCooldown'), SHORTER_LASER_DURATION_MS);
        break;

      case 'shotCooldown':
        setLaserActive(false);
        setLaserHeight(0);
        laserFireCountRef.current += 1; 
        scheduleAction(() => setLaserShotStep('prepareShot'), LASER_REFIRE_DELAY_MS); 
        break;
    }
  }, [ufoFSMState, laserShotStep, scheduleAction, laserActive, laserHeight]);


  const handleNormalFlight = useCallback(() => {
    setUfoPosition(prev => {
      let newX = prev.x + NORMAL_SPEED; 
      if (newX > window.innerWidth + UFO_BASE_WIDTH / 2) newX = -UFO_BASE_WIDTH / 2 * 1.5; 
      const waveAmplitude = 35;
      const waveFrequency = 0.008;
      const newY = 150 + Math.sin(newX * waveFrequency) * waveAmplitude;
      const verticalVelocity = Math.cos(newX * waveFrequency) * waveAmplitude * waveFrequency * NORMAL_SPEED;
      setTilt({ x: -verticalVelocity * 3.5, z: Math.sin(newX * 0.015) * 12 });
      return { x: newX, y: newY };
    });
  }, []);


  const handleFiringLaser = useCallback(() => {
    if (laserActive) {
      const visualUfoBottomY = ufoPosition.y + (UFO_BASE_HEIGHT * UFO_SCALE / 2);
      setLaserHeight(window.innerHeight - visualUfoBottomY ); 
    } else {
      setLaserHeight(0); 
    }
  }, [laserActive, ufoPosition.y]);

  const handlePostLaserMove = useCallback(() => {
    setUfoPosition(prev => ({ x: prev.x + currentSpeed, y: prev.y }));
    setTilt({ x: -2, z: 0 }); 
  }, [currentSpeed]);

  const handleHyperjumping = useCallback(() => {
    setUfoPosition(prev => {
      const newX = prev.x + currentSpeed;
      
      if (newX > window.innerWidth + UFO_BASE_WIDTH || newX < -UFO_BASE_WIDTH * 1.5) { 
        setIsStretched(false);
        setUfoFSMState('returning');
        setUfoPosition({ x: -UFO_BASE_WIDTH * 10, y: -UFO_BASE_HEIGHT * 10 }); 
        
        scheduleAction(() => {
          const scaledUfoWidth = UFO_BASE_WIDTH * UFO_SCALE;
          const scaledUfoHeight = UFO_BASE_HEIGHT * UFO_SCALE;

          const marginX = scaledUfoWidth / 2;
          const marginY = scaledUfoHeight / 2;

          const spawnableWidth = Math.max(0, window.innerWidth - scaledUfoWidth);
          const spawnableHeight = Math.max(0, window.innerHeight - scaledUfoHeight);

          const enterX = marginX + Math.random() * spawnableWidth;
          const enterY = marginY + Math.random() * spawnableHeight;
          
          setUfoPosition({ x: enterX, y: enterY });
          setCurrentSpeed(NORMAL_SPEED); 
          setUfoFSMState('normal'); 
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
      
      const newX = prev.x + moveX;
      const newY = prev.y + moveY;

      const angleToTarget = Math.atan2(dy, dx);
      const desiredTiltZ = -Math.cos(angleToTarget) * 25; 
      const desiredTiltX = -Math.sin(angleToTarget) * 20; 
      setTilt(prevTilt => ({
        x: prevTilt.x * 0.85 + desiredTiltX * 0.15, 
        z: prevTilt.z * 0.85 + desiredTiltZ * 0.15,
      }));

      return { x: newX, y: newY };
    });
  }, [randomMoveTarget]); 


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
    animationFrameRef.current = requestAnimationFrame(updateUfoAndWorld);
  }, [
    ufoFSMState, currentSpeed, ufoPosition, 
    handleNormalFlight, handleFiringLaser, handlePostLaserMove, 
    handleHyperjumping, handleRandomMoving, 
  ]);
  
  // Main animation loop effect
  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(updateUfoAndWorld);
    return () => { // This cleanup runs when component unmounts OR when dependencies change
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      // DO NOT call clearActionTimeout() here, as it prematurely clears scheduled actions like hyperjump transition
    };
  }, [updateUfoAndWorld]); 

  // Effect for unmount cleanup of actionTimeoutRef
  useEffect(() => {
    return () => {
      clearActionTimeout();
    };
  }, [clearActionTimeout]);


  useEffect(() => {
    if (ufoFSMState === 'normal') {
      const eventTimer = setTimeout(() => {
        if (ufoFSMState === 'normal') { 
           setUfoFSMState('stopping');
        }
      }, EVENT_SEQUENCE_TRIGGER_MS + Math.random() * 5000);
      return () => clearTimeout(eventTimer);
    } 
    else if (ufoFSMState === 'randomMoving') { 
        const normalTimer = setTimeout(() => {
            if (ufoFSMState === 'randomMoving') { 
                setUfoFSMState('normal');
                setCurrentSpeed(NORMAL_SPEED); 
                setRandomMoveTarget(null); 
            }
        }, RANDOM_MOVE_DURATION_MS + Math.random() * 3000);
        return () => clearTimeout(normalTimer);
    }
  }, [ufoFSMState]);


  const engineLights = useMemo(() => Array(5).fill(null).map((_, i) => ({
    id: i,
    intensity: Math.random() * 0.4 + 0.6,
    delay: i * 0.11
  })), []);

  return (
    <div className="ufo-viewport">
      {trail.map((pos) => (
        <div
          key={pos.id}
          className="ufo-trail-particle"
          style={{
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            opacity: pos.opacity,
            transform: `translate(-50%, -50%) scale(${pos.scale}) scaleX(${pos.scaleX || 1})`,
            backgroundColor: pos.color, 
          }}
        />
      ))}

      <div
        className="ufo-perspective-group" 
        style={{
          transform: `translate(${ufoPosition.x - UFO_BASE_WIDTH / 2}px, ${ufoPosition.y - UFO_BASE_HEIGHT / 2}px)`,
        }}
      >
        <div 
          className="ufo-scaler-wrapper" 
          style={{ 
            transform: `scale(${UFO_SCALE})`,
            width: '100%', 
            height: '100%',
            transformOrigin: 'center center', 
          }}
        >
          <div
            className="ufo-body" 
            style={{
              transform: `rotateX(${tilt.x}deg) rotateZ(${tilt.z}deg) ${isStretched ? 'scaleX(2.5) scaleY(0.7)' : ''}`,
              transition: isStretched ? 'transform 0.15s ease-in' : 'transform 0.1s ease-out',
            }}
          >
            <div className="ufo-spinner">
              <div className="ufo-shimmer-hull" />
              <div className="ufo-dome">
                <div className="ufo-dome-glow-orb" />
                <div className="ufo-dome-highlight" />
                <div className="ufo-dome-static-pattern">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={`static-${i}`} 
                      className="ufo-dome-static-line" 
                      style={{ top: `${25 + i * 18}%`, animationDelay: `${i * 0.7}s` }}
                    />
                  ))}
                </div>
              </div>
              <div className="ufo-mid-section">
                <div className="ufo-running-light-strip">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={`runlight-${i}`}
                      className="ufo-running-light"
                      style={{ animationDelay: `${i * 0.22}s` }}
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
            </div>
          </div>
        </div> 
        
        {(laserActive || laserShotStep !== 'idle' || ufoFSMState === 'firingLaser') && (
          <div
            className="ufo-laser-beam"
            style={{
              top: `${UFO_BASE_HEIGHT * 0.85}px`, 
              left: `${UFO_BASE_WIDTH / 2}px`, 
              transform: 'translateX(-50%)', 
              height: `${laserHeight}px`,
            }}
          />
        )}
      </div>
      <div
        className="ufo-ambient-aura" 
        style={{
          left: `${ufoPosition.x}px`, 
          top: `${ufoPosition.y}px`,
        }}
      />
    </div>
  );
};

export default RealisticUfo;
