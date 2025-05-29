import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useConnect, useDisconnect, useActiveAccount, useActiveWallet } from 'thirdweb/react';
import { createWallet } from 'thirdweb/wallets';
import { toast } from 'react-hot-toast';
import { createThirdwebClient } from 'thirdweb';
import './Navbar.css';

declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  // Thirdweb hooks
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const { connect, isConnecting } = useConnect();
  const { disconnect } = useDisconnect();

  // Configuración del cliente de Thirdweb
  const client = createThirdwebClient({
    clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID || 'YOUR_CLIENT_ID',
  });

  const handleConnect = async () => {
    if (account) return; // Already connected
    
    try {
      toast.loading('Connecting wallet...');
      
      // Create and connect the wallet
      const connectedWallet = await connect(
        async () => {
          const wallet = createWallet("io.metamask");
          // Connect the wallet with the client
          await wallet.connect({ client });
          return wallet;
        }
      );
      
      if (!connectedWallet) {
        throw new Error('Failed to connect wallet: No wallet returned');
      }
      
      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to connect wallet');
    }
  };
  
  const handleDisconnect = async () => {
    try {
      if (wallet) {
        await disconnect(wallet);
        toast.success('Wallet disconnected');
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      toast.error('Failed to disconnect wallet');
    }
  };
  
  // Efecto para manejar el scroll
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // Clase para los botones del navbar
  const navButtonClass = (path: string) => 
    `nav-button ${location.pathname === path ? 'active' : ''}`;



  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
    
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-1">
            <Link 
              to="/" 
              className={navButtonClass('/')}
            >
              HOME
            </Link>
            <Link 
              to="/ai-assistant" 
              className={navButtonClass('/ai-assistant')}
            >
              AI ASSISTANT
            </Link>
            <a 
              href="https://wealth-protocol.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className={navButtonClass('/ordinal')}
            >
              ORDINAL
            </a>
          </div>
          <div className="flex items-center">
            {account ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-300 text-sm">
                  {`${account.address.slice(0, 6)}...${account.address.slice(-4)}`}
                </span>
                <button
                  onClick={handleDisconnect}
                  className="relative px-6 py-2 text-sm font-medium text-white rounded-md group"
                  style={{
                    background: 'linear-gradient(45deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    backdropFilter: 'blur(5px)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <span className="relative z-10">Disconnect</span>
                  <span 
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-md opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="relative px-6 py-2 text-sm font-medium text-white rounded-md group"
                  style={{
                    background: 'linear-gradient(45deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    backdropFilter: 'blur(5px)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <span className="relative z-10">
                    {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                  </span>
                  <span 
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-md opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
