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
    return <LoadingPage />;
  }

  return (
    <div className="app-container relative min-h-screen flex flex-col">
      <ParticlesBackground />
      <RealisticUfo />
      <Navbar />
      <header className="header relative z-10 w-full max-w-7xl flex flex-col items-center py-2 mb-4 px-3 mx-auto">
        <div className="flex flex-col items-center text-center w-full">
          <img
            src="https://petgascoin.com/wp-content/uploads/2025/05/UCA-logo-fondo-blanco-horizontal-1-scaled-e1746841493573.png"
            alt="UCA Logo"
            className="app-logo w-16 h-auto mt-4 mb-2"
          />
          <h1 className="text-2xl font-semibold mb-2 text-white">
            NFT Boutique Marketplace
          </h1>
          <h2 className="text-lg text-gray-300 mb-2">
            Arte Eterno Collection - MACQ
          </h2>
          <div className="w-full max-w-4xl px-4">
            <MarqueeTicker nfts={[
              { id: 'TEM', name: 'Tides of the Eternal Mind' },
              { id: 'GCC', name: 'Galactic Clean-Up Crew' },
              { id: 'EVC', name: 'Entre la Vida y el Plástico' },
              { id: 'CMV', name: 'C0mMzoVeRLoAD' },
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
