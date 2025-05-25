import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Spinner from './Spinner';

interface LoadingPageProps {
  onLoadingComplete: () => void;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Iniciando plataforma...');

  useEffect(() => {
    // Animación de carga simulada
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        
        // Actualizar estado según el progreso
        if (newProgress < 20) {
          setStatus('Conectando a la red Ethereum...');
        } else if (newProgress < 40) {
          setStatus('Cargando contratos inteligentes...');
        } else if (newProgress < 60) {
          setStatus('Obteniendo activos digitales...');
        } else if (newProgress < 80) {
          setStatus('Preparando interfaz de usuario...');
        } else {
          setStatus('¡Casi listo!');
        }
        
        // Completar la carga al llegar al 100%
        if (newProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onLoadingComplete();
          }, 500);
          return 100;
        }
        
        return newProgress;
      });
    }, 300);

    return () => clearInterval(timer);
  }, [onLoadingComplete]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#0f0e15',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #0f0e15 0%, #1e1b2e 100%)',
      color: 'white',
      overflow: 'hidden'
    }}>
      {/* Logo */}
      <div style={{
        marginBottom: '30px',
        opacity: 0.9
      }}>
        <img 
          src="https://petgascoin.com/wp-content/uploads/2025/05/UCA-logo-fondo-blanco-horizontal-1-scaled-e1746841493573.png" 
          alt="MACQ Logo" 
          style={{
            height: '60px',
            marginBottom: '20px',
            filter: 'drop-shadow(0 0 10px rgba(168, 85, 247, 0.5))'
          }}
        />
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 700,
          margin: '10px 0',
          background: 'linear-gradient(90deg, #a855f7, #3b82f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          NFT Boutique Marketplace
        </h1>
        <p style={{
          color: '#a0a0a0',
          fontSize: '1.1rem',
          marginTop: '5px'
        }}>
          Arte Eterno Collection - MACQ
        </p>
      </div>

      {/* Spinner */}
      <div style={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        margin: '30px 0',
        minHeight: '80px'
      }}>
        <Spinner />
      </div>

      {/* Status Text */}
      <p style={{
        fontSize: '1.1rem',
        margin: '20px 0',
        color: '#e0e0e0',
        maxWidth: '500px',
        lineHeight: '1.5'
      }}>
        {status}
      </p>

      {/* Progress Bar */}
      <div style={{
        width: '100%',
        maxWidth: '400px',
        height: '6px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '3px',
        margin: '20px 0',
        overflow: 'hidden'
      }}>
        <motion.div 
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #a855f7, #3b82f6)',
            borderRadius: '3px',
            boxShadow: '0 0 10px rgba(168, 85, 247, 0.5)'
          }}
        />
      </div>

      {/* Progress Percentage */}
      <p style={{
        color: '#a0a0a0',
        fontSize: '0.9rem',
        marginTop: '10px'
      }}>
        {Math.round(progress)}% completado
      </p>

      {/* Animated background elements */}
      {Array(20).fill(0).map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: '4px',
            height: '4px',
            backgroundColor: 'white',
            borderRadius: '50%',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.7,
            boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.8)'
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: Math.random() * 2
          }}
        />
      ))}
    </div>
  );
};

export default LoadingPage;
