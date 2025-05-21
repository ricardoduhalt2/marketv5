import './App.css';
import { Routes, Route } from 'react-router-dom';
import { ConnectButton } from 'thirdweb/react';
import { polygon } from 'thirdweb/chains';
import { client } from './main';
import NFTList from './components/NFTList';
import NFTDetail from './components/NFTDetail';
import AiAssistantButton from './components/AiAssistantButton';
import AiAssistant from './pages/AiAssistant';

function App() {
  return (
    <div className="app-container">
      <header className="header w-full max-w-7xl flex flex-col items-center py-4 mb-6 px-3 sm:py-6 sm:mb-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center min-w-0 overflow-hidden w-full">
          <img
            src="https://petgascoin.com/wp-content/uploads/2025/05/UCA-logo-fondo-blanco-horizontal-1-scaled-e1746841493573.png"
            alt="UCA Logo"
            className="app-logo desktop-logo w-12 sm:w-16 h-auto mt-8 sm:mt-12 mb-2"
          />
          <img
            src="https://petgascoin.com/wp-content/uploads/2025/05/Unlockable-Content-Agency.png"
            alt="UCA Mobile Logo"
            className="app-logo mobile-logo w-12 sm:w-16 h-auto mt-8 sm:mt-12 mb-2"
          />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 px-2">NFT Boutique Marketplace</h1>
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full max-w-xs sm:max-w-none px-2">
            <AiAssistantButton />
            <ConnectButton
              client={client}
              chain={polygon}
              theme="dark"
              connectModal={{ size: "compact" }}
            />
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl text-gray-300 mt-4 px-2">Arte Eterno Collection - MACQ</h2>
          <div className="mobile-mode-indicator">MOBILE MODE</div>
        </div>
      </header>

      <main className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<NFTList />} />
          <Route path="/nft/:id" element={<NFTDetail />} />
          <Route path="/ai-assistant" element={<AiAssistant />} />
        </Routes>
      </main>

      <footer className="w-full max-w-7xl text-center py-10 mt-auto px-4 sm:px-6 lg:px-8">
        <p className="footer-marquee-text mt-4">
          Arte Eterno Collection - Exhibiting at the Museum of Contemporary Art, Quintana Roo (MACQ)
        </p>
      </footer>
    </div>
  );
}

export default App;
