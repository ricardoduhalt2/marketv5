/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'orbitron': ['Orbitron', 'sans-serif'],
        'fira-code': ['Fira Code', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'spin-slow-reverse': 'spin-reverse 3s linear infinite',
        'float1': 'float1 4s ease-in-out infinite',
        'float2': 'float2 5s ease-in-out infinite',
        'float3': 'float3 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'twinkle': 'twinkle 2s ease-in-out infinite',
        'realistic-shooting': 'realistic-shooting var(--duration, 2s) ease-in-out infinite',
        'fade-in': 'fadeIn 1s ease-out',
        'clockwise-rotate': 'clockwise-rotate 3s linear infinite',
        'counter-clockwise-rotate': 'counter-clockwise-rotate 2.5s linear infinite',
        'segment-glitch': 'segment-glitch 3s infinite',
        'blink-cursor': 'blinkCursor 1s step-end infinite',
        'portal-float': 'portalFloat 12s ease-in-out infinite',
        'subtle-pulse': 'subtle-pulse 3s ease-in-out infinite',
        'spark-animation': 'sparkAnimation var(--duration, 1s) linear forwards',
      },
      keyframes: {
        'spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'spin-reverse': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
        'pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'float1': {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '33%': { transform: 'translate(30px, -20px) rotate(120deg)' },
          '66%': { transform: 'translate(-20px, 20px) rotate(240deg)' },
        },
        'float2': {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '33%': { transform: 'translate(-25px, 15px) rotate(-90deg)' },
          '66%': { transform: 'translate(20px, -15px) rotate(90deg)' },
        },
        'float3': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(15px, -10px) scale(1.5)' },
        },
        'twinkle': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
        'realistic-shooting': {
          '0%': {
            transform: 'translate3d(var(--start-x, 0), var(--start-y, 0), 0) rotate(var(--angle, 0deg)) scaleX(0)',
            opacity: '0',
          },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': {
            transform: 'translate3d(calc(var(--start-x, 0) + var(--travel-x, 0)), calc(var(--start-y, 0) + var(--travel-y, 0)), 0) rotate(var(--angle, 0deg)) scaleX(1)',
            opacity: '0',
          },
        },
        'fadeIn': {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        'clockwise-rotate': {
          'from': { transform: 'translate(-50%, -50%) rotate(0deg)' },
          'to': { transform: 'translate(-50%, -50%) rotate(360deg)' },
        },
        'counter-clockwise-rotate': {
          'from': { transform: 'translate(-50%, -50%) rotate(0deg)' },
          'to': { transform: 'translate(-50%, -50%) rotate(-360deg)' },
        },
        'segment-glitch': {
          '0%, 100%': { opacity: '0', transform: 'translate(-50%, -50%) scale(1)' },
          '2%': { opacity: '1', transform: 'translate(-50%, -50%) scale(1.2)' },
          '3%': { opacity: '0', transform: 'translate(-50%, -50%) scale(1.1)' },
          '10%': { opacity: '0', transform: 'translate(-50%, -50%) scale(1)' },
          '10.1%': { opacity: '0', transform: 'translate(-50%, -50%) scale(1)' },
          '10.2%': { 
            opacity: '1', 
            transform: 'translate(calc(-50% - 5px), calc(-50% - 5px)) scale(1.1)',
            backgroundColor: 'var(--glitch-color-1, #34d399)',
          },
          '10.3%': { opacity: '0', transform: 'translate(-50%, -50%) scale(1)' },
          '20%': { opacity: '0', transform: 'translate(-50%, -50%) scale(1)' },
          '20.1%': { 
            opacity: '1', 
            transform: 'translate(calc(-50% + 5px), calc(-50% - 5px)) scale(1.1)',
            backgroundColor: 'var(--glitch-color-2, #eab308)',
          },
          '20.2%': { opacity: '0', transform: 'translate(-50%, -50%) scale(1)' },
        },
        'blinkCursor': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'portalFloat': {
          '0%, 100%': { transform: 'translate(-50%, -50%) translateY(0) scale(1)' },
          '50%': { transform: 'translate(-50%, -50%) translateY(-10px) scale(1.02)' },
        },
        'subtle-pulse': {
          '0%, 100%': { 
            boxShadow: '0 0 25px 8px rgba(249, 115, 22, 0.5), 0 0 45px 20px rgba(249, 115, 22, 0.25), inset 0 0 10px rgba(0, 0, 0, 0.6)',
          },
          '50%': {
            boxShadow: '0 0 30px 10px rgba(249, 115, 22, 0.6), 0 0 50px 25px rgba(249, 115, 22, 0.3), inset 0 0 15px rgba(0, 0, 0, 0.7)',
          },
        },
        'sparkAnimation': {
          'to': {
            transform: 'translate3d(var(--spark-dx, 0), var(--spark-dy, 0), 0)',
            opacity: '0',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    function({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
        },
        '.scrollbar-thumb-purple-500': {
          '&::-webkit-scrollbar-thumb': {
            'background-color': '#a855f7',
            'border-radius': '4px',
          },
        },
        '.scrollbar-track-black\/50': {
          '&::-webkit-scrollbar-track': {
            'background-color': 'rgba(0, 0, 0, 0.5)',
          },
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
}