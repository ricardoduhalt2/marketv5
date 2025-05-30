import './App.css';
import { Routes, Route } from 'react-router-dom';
import { createThirdwebClient } from 'thirdweb';
import Navbar from './components/Navbar';

createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID || 'YOUR_CLIENT_ID',
});
import NFTList from './components/NFTList';
import NFTDetail from './components/NFTDetail';
import AiAssistant from './pages/AiAssistant';
import ParticlesBackground from './components/ParticlesBackground';
import LoadingPage from './components/LoadingPage';
import { useState, useEffect } from 'react';
import RealisticUfo from './components/RealisticUfo';
import MarqueeTicker from './components/MarqueeTicker';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate resource loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 9999, background: '#050505' }}>
        <LoadingPage />
      </div>
    );
  }

  return (
    <div className="app-container relative min-h-screen flex flex-col">
      <ParticlesBackground />
      <RealisticUfo />
      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id="gradient-outline" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
            <feComponentTransfer in="blur" result="glow">
              <feFuncA type="linear" slope="2" intercept="0"/>
            </feComponentTransfer>
            <feFlood floodColor="#ff6b00" result="color1" />
            <feFlood floodColor="#9d4edd" result="color2" />
            <feFlood floodColor="#4361ee" result="color3" />
            <feFlood floodColor="#4cc9f0" result="color4" />
            <feComposite in="color1" in2="glow" operator="in" result="glow1" />
            <feComposite in="color2" in2="glow" operator="in" result="glow2" />
            <feComposite in="color3" in2="glow" operator="in" result="glow3" />
            <feComposite in="color4" in2="glow" operator="in" result="glow4" />
            <feMerge>
              <feMergeNode in="glow1" />
              <feMergeNode in="glow2" />
              <feMergeNode in="glow3" />
              <feMergeNode in="glow4" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      <Navbar />
      <header className="header relative z-10 w-full max-w-7xl flex flex-col items-center pt-16 pb-2 mb-2 px-3 mx-auto">
        <div className="flex flex-col items-center text-center w-full">
          <div className="relative flex items-center justify-center mb-6 group">
            <div className="relative">
              <div className="relative w-16 h-16">
                {/* Animated gradient glow effect */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(90deg, #ff6b00, #9d4edd, #4361ee, #4cc9f0, #9d4edd, #ff3c5f)',
                    backgroundSize: '300% 100%',
                    WebkitMask: 'url(https://petgascoin.com/wp-content/uploads/2025/05/UCA-logo-fondo-blanco-horizontal-1-scaled-e1748567694616.png) center/contain no-repeat',
                    mask: 'url(https://petgascoin.com/wp-content/uploads/2025/05/UCA-logo-fondo-blanco-horizontal-1-scaled-e1748567694616.png) center/contain no-repeat',
                    filter: 'blur(3px)',
                    opacity: '0.9',
                    zIndex: 1,
                    animation: 'gradient 8s linear infinite',
                  }}
                ></div>
                {/* Original logo */}
                <img
                  src="https://petgascoin.com/wp-content/uploads/2025/05/UCA-logo-fondo-blanco-horizontal-1-scaled-e1748567694616.png"
                  alt="UCA Logo"
                  className="relative z-10 w-full h-full object-contain"
                  style={{
                    filter: 'drop-shadow(0 0 1px white)'
                  }}
                />
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-semibold mb-2 text-white">
            NFT Boutique Marketplace
          </h1>
          <h2 className="text-lg text-gray-300 mb-2">
            Arte Eterno Collection - MACQ
          </h2>
          <div className="w-screen overflow-hidden px-0 -mx-4">
            <MarqueeTicker nfts={[
              { id: 'TEM', name: 'Tides of the Eternal Mind' },
              { id: 'GCC', name: 'Galactic Clean-Up Crew' },
              { id: 'EVC', name: 'Entre la vida y el plastico es de $pinche$chucho' },
              { id: 'CMV', name: 'C0mMzoVeRLoAD by Daughter of the Son' },
              { id: 'BBB', name: 'Bit-Beats Bliss' },
              { id: 'IVT', name: 'I vow to take care of you' },
              { id: 'YSL', name: 'Yo Soy Libertad' },
              { id: 'MOL', name: 'MOON LANDING' },
              { id: 'HTC', name: 'Hydrothermal Camouflage' },
              { id: 'FLC', name: 'Floral Coral' },
              { id: 'SWH', name: 'Snail Whale' },
              { id: 'RAI', name: 'regenAIssance (i.)' },
              { id: 'TRG', name: 'Treegeneration' },
              { id: 'CHIDO', name: 'C.H.I.D.O.' }
            ]} />
          </div>
        </div>
      </header>

      <main className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto flex-grow">
        <Routes>
          <Route path="/" element={<NFTList />} />
          <Route path="/nft/:id" element={<NFTDetail />} />
          <Route path="/ai-assistant" element={<AiAssistant />} />
        </Routes>
      </main>

      <footer className="w-full max-w-7xl text-center py-10 mt-auto px-4 sm:px-6 lg:px-8 mx-auto">
        <p className="text-gray-400 text-sm">
          Arte Eterno Collection - Exhibiting at the Museum of Contemporary Art, Quintana Roo (MACQ)
        </p>
      </footer>
    </div>
  );
}

export default App;
