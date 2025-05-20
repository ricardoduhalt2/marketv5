import './App.css'; // Re-enable App.css for the new styles
import { useState, useEffect } from 'react'; // Import useState and useEffect
import { ConnectButton } from 'thirdweb/react';
import { polygon } from 'thirdweb/chains';
import { client } from './main'; // Import the initialized client
import DropCard from './components/DropCard';
import { nftData } from './data/nftData'; // Import the actual NFT data from the correct path
import type { NftData } from './types'; // Import NftData type from types
import Chatbot from './components/Chatbot'; // Import the Chatbot component

function App() {
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Simulate a 2-second loading time

    return () => clearTimeout(timer); // Clean up the timer
  }, []);

  return (
    // Use the new .app-container for overall layout and background
    <div className="app-container">
      <header className="header w-full max-w-7xl flex flex-col items-center py-6 mb-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center min-w-0 overflow-hidden">
          <img
            src="https://petgascoin.com/wp-content/uploads/2025/05/UCA-logo-fondo-blanco-horizontal-1-scaled-e1746841493573.png"
            alt="UCA Logo"
            className="app-logo desktop-logo w-16 h-auto mt-12 mb-2" // Increased mt-8 to mt-12, Restored w-16, margin bottom for logo, Added desktop-logo class
          />
          <img
            src="https://petgascoin.com/wp-content/uploads/2025/05/Unlockable-Content-Agency.png"
            alt="UCA Mobile Logo"
            className="app-logo mobile-logo w-16 h-auto mt-12 mb-2" // Added mobile logo with mobile-logo class
          />
          <h1 className="text-6xl">NFT Boutique Marketplace Arte Eterno Collection - Exhibiting at the Museum of Contemporary Art, Quintana Roo (MACQ)</h1> {/* Combined titles */}
          <div className="mobile-mode-indicator">MOBILE MODE</div> {/* Added mobile mode indicator */}
        </div>
        <div className="flex justify-center">
          <ConnectButton
            client={client}
            chain={polygon}
            theme="dark"
            connectModal={{ size: "compact" }}
          />
        </div>
      </header>

      <main className="w-full max-w-7xl px-4 sm:px-6 lg:px-8"> {/* Reverted: max-w-7xl restored, grid classes on inner div */}
        {/* Apply .card-base to each DropCard for the new card styling and animations */}
        {/* Container for NFT cards */}
        {isLoading ? ( // Conditionally render based on loading state
          <div className="loading-spinner"></div> // Simple loading spinner
        ) : (
          <div className="nft-cards-container"> {/* Using custom class for layout */}
            {nftData.map((nft: NftData) => ( // Use nftData and add NftData type annotation
              <div key={nft.name} className="card-base"> {/* Use nft.name as key, Wrap DropCard in a div with .card-base */}
                <DropCard nft={nft} client={client} />
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="w-full max-w-7xl text-center py-10 mt-auto px-4 sm:px-6 lg:px-8">
        {/* Removed static footer text */}
        <p className="footer-marquee-text mt-4"> {/* Added static marquee text to footer */}
          Arte Eterno Collection - Exhibiting at the Museum of Contemporary Art, Quintana Roo (MACQ)
        </p>
      </footer>
      <Chatbot />
    </div>
  );
}

export default App;
