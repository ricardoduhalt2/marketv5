import React, { useEffect } from 'react';

const Spinner: React.FC = () => {
  useEffect(() => {
    // Añadir estilos globales para la animación
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div style={{
      position: 'relative',
      width: '80px',
      height: '80px',
      margin: '0 auto'
    }}>
      {/* Anillo exterior */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        border: '4px solid rgba(168, 85, 247, 0.2)',
        borderRadius: '50%',
        borderTopColor: '#a855f7',
        borderRightColor: '#a855f7',
        animation: 'spin 1.5s linear infinite',
        boxShadow: '0 0 15px rgba(168, 85, 247, 0.3)'
      }}></div>
      
      {/* Anillo medio */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '15%',
        width: '70%',
        height: '70%',
        border: '3px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '50%',
        borderTopColor: '#3b82f6',
        borderRightColor: '#3b82f6',
        animation: 'spin 1.2s linear infinite reverse',
        boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)'
      }}></div>
      
      {/* Círculo central */}
      <div style={{
        position: 'absolute',
        top: '35%',
        left: '35%',
        width: '30%',
        height: '30%',
        backgroundColor: '#a855f7',
        borderRadius: '50%',
        animation: 'pulse 1.5s ease-in-out infinite',
        boxShadow: '0 0 10px rgba(168, 85, 247, 0.8)'
      }}></div>
    </div>
  );
};

export default Spinner;
