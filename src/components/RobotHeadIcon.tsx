import React, { useEffect, useRef } from 'react';

const RobotHeadIcon: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size to match parent
    const size = 32; // Base size for the icon
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    
    // Animation variables
    let time = 0;
    const animate = () => {
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(size / 32, size / 32); // Scale to 32x32 grid
      
      // Draw robot head
      const headY = 10 + Math.sin(time * 2) * 0.5; // Subtle floating animation
      
      // Head base (metallic)
      const gradient = ctx.createLinearGradient(8, 4, 24, 28);
      gradient.addColorStop(0, '#a0aec0');
      gradient.addColorStop(0.5, '#e2e8f0');
      gradient.addColorStop(1, '#a0aec0');
      
      ctx.beginPath();
      ctx.roundRect(8, headY, 16, 16, [4, 4, 6, 6]);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Add some metallic shine
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 0.8;
      ctx.stroke();
      
      // Eyes (animate between blue and cyan)
      const eyeColor = `hsl(${200 + Math.sin(time * 3) * 30}, 100%, 60%)`;
      
      // Left eye
      ctx.beginPath();
      ctx.arc(14, headY + 8, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = eyeColor;
      ctx.fill();
      
      // Right eye
      ctx.beginPath();
      ctx.arc(18, headY + 8, 2.5, 0, Math.PI * 2);
      ctx.fill();
      
      // Eye shine (animation)
      const shineX = Math.sin(time * 4) * 0.8;
      const shineY = Math.cos(time * 4) * 0.5;
      
      // Left eye shine
      ctx.beginPath();
      ctx.arc(14 + shineX, headY + 7 + shineY, 0.8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fill();
      
      // Right eye shine
      ctx.beginPath();
      ctx.arc(18 + shineX, headY + 7 + shineY, 0.8, 0, Math.PI * 2);
      ctx.fill();
      
      // Antenna
      ctx.beginPath();
      ctx.moveTo(16, headY);
      ctx.lineTo(16, headY - 6);
      ctx.strokeStyle = '#a0aec0';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      
      // Antenna light (pulses)
      const pulse = 0.7 + Math.abs(Math.sin(time * 3)) * 0.3;
      ctx.beginPath();
      ctx.arc(16, headY - 6, 2 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(99, 179, 237, ${pulse})`;
      ctx.fill();
      
      ctx.restore();
      
      time += 0.02;
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className={`inline-block align-middle ${className}`}
      style={{
        width: '32px',
        height: '32px',
        verticalAlign: 'middle',
        margin: '0 2px'
      }}
    />
  );
};

export default RobotHeadIcon;
