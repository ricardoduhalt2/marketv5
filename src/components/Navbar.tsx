import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useConnect, useDisconnect, useActiveAccount, useActiveWallet } from 'thirdweb/react';
import { createWallet } from 'thirdweb/wallets';
import { toast } from 'react-hot-toast';
import { createThirdwebClient } from 'thirdweb';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Thirdweb hooks
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const { connect, isConnecting } = useConnect();
  const { disconnect } = useDisconnect();

  // Logs de depuración
  console.log('Account:', account);
  console.log('Wallet:', wallet);
  console.log('isConnecting:', isConnecting);

  // Configuración del cliente de Thirdweb
  const client = createThirdwebClient({
    clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID || 'YOUR_CLIENT_ID',
  });
  
  console.log('Thirdweb Client ID:', import.meta.env.VITE_THIRDWEB_CLIENT_ID);

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
      
      toast.dismiss();
      toast.success('Wallet connected!');
      console.log('Wallet connected:', connectedWallet);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.dismiss();
      
      const errorMessage = error instanceof Error 
        ? error.message.includes('rejected')
          ? 'Connection rejected by user'
          : error.message.includes('already pending')
            ? 'A wallet connection is already in progress'
            : 'Failed to connect wallet'
        : 'Failed to connect wallet';
        
      toast.error(errorMessage);
    }
  };

  const handleDisconnect = async () => {
    if (!wallet) return;
    
    try {
      await disconnect(wallet);
      console.log("Wallet disconnected successfully");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  interface NavItem {
    name: string;
    path: string;
    external?: boolean;
    special?: boolean;
  }

  const navItems: NavItem[] = [
    { name: 'Inicio', path: '/' },
    { 
      name: 'ORDINAL', 
      path: 'https://wealth-protocol.vercel.app/',
      external: true,
      special: true
    },
    { name: 'Asistente IA', path: '/ai-assistant' },
  ];

  return (
    <div className="relative">
      <nav className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-gray-900/95 backdrop-blur-md shadow-xl border-b border-gray-800/50' 
          : 'bg-gradient-to-b from-gray-900/80 to-transparent'
      }`} style={{ zIndex: 1000 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24 items-start pt-2">
          {/* Logo con brillo sutil */}
          <Link to="/" className="flex items-center mt-1 relative group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-lg blur-sm opacity-70 group-hover:opacity-100 transition-all duration-300"></div>
              <img 
                src="https://petgascoin.com/wp-content/uploads/2025/05/UCA-logo-fondo-blanco-horizontal-1-scaled-e1746841493573.png" 
                alt="Logo" 
                className="h-10 md:h-12 transition-all duration-300 transform group-hover:scale-105 relative z-10"
                style={{
                  filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.5))',
                  transition: 'all 0.3s ease-in-out'
                }}
              />
            </div>
          </Link>
          {/* Logo */}
          <Link 
            to="/" 
            className="group relative flex items-center space-x-3"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-blue-500/20 rounded-full blur-sm group-hover:bg-blue-400/30 transition-all duration-300 group-hover:scale-110"></div>
              <div className="relative h-10 w-10 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-sm border border-blue-400/30 overflow-hidden">
                <img 
                  src="/macq_logo_black.png" 
                  alt="MACQ Logo" 
                  className="h-8 w-8 object-contain filter brightness-125 contrast-125"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(96, 165, 250, 0.7))' }}
                />
              </div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
              MACQ <span className="text-white">Gallery</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || 
                            (location.pathname.includes('nft/') && item.path === '/nfts');
              
              if (item.external) {
                return (
                  <a
                    key={item.path}
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`relative px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-500 group overflow-hidden ${
                      item.special 
                        ? 'bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/30 transform hover:-translate-y-0.5 animate-gradient-xy'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    {item.special && (
                      <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    )}
                    <span className="relative z-10 flex items-center">
                      {item.name}
                      {item.special && (
                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H4"></path>
                        </svg>
                      )}
                    </span>
                  </a>
                );
              }
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 group ${
                    isActive
                      ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-md'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Connect Button - Forzando visibilidad */}
          <div className="fixed top-4 right-4 z-50 bg-gray-800 p-2 rounded-lg shadow-lg">
            <div className="text-xs text-white mb-1">Estado: {account ? 'Conectado' : 'No conectado'}</div>
            {account ? (
              <div className="relative group">
                <button 
                  onClick={handleDisconnect}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium rounded-full text-sm shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-blue-600 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center space-x-2"
                >
                  <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></span>
                  <span>{`${account.address.slice(0, 6)}...${account.address.slice(-4)}`}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl py-1 z-50 hidden group-hover:block">
                  <button
                    onClick={handleDisconnect}
                    className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                  >
                    Disconnect Wallet
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={handleConnect}
                disabled={isConnecting}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium rounded-full text-sm shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-blue-600 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center space-x-2 group"
              >
                {isConnecting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Conectando a tu wallet...
                  </>
                ) : (
                  <>
                    <span className="relative">
                      <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2h-2.5M3 17a2 2 0 002 2h4a2 2 0 002-2v-4a2 2 0 00-2-2h-2.5"></path>
                    </svg>
                    </span>
                    <span>Connect Wallet</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <a
              href="https://wealth-protocol.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              ORDINAL
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-all duration-300"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!mobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden fixed inset-0 bg-gray-900/95 backdrop-blur-lg z-40 transition-all duration-300 transform ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="pt-20 pb-6 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            if (item.external && item.special) {
              return (
                <a
                  key={item.path}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-3 rounded-lg text-base font-medium text-center text-white bg-gradient-to-r from-purple-600 to-blue-500 shadow-md hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 mb-4"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center justify-center">
                    {item.name}
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                  </div>
                </a>
              );
            }
            
            if (item.external) {
              return (
                <a
                  key={item.path}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              );
            }
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-300 ${
                  isActive
                    ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-md'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
        
        <div className="px-4">
          {account ? (
            <>
              <div className="mt-2 p-3 bg-gray-800/50 rounded-md text-sm text-center">
                <p className="text-gray-300 truncate">{`Conectado: ${account.address}`}</p>
              </div>
              <button 
                onClick={handleDisconnect}
                className="w-full mt-2 px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-md text-base font-medium"
              >
                Desconectar
              </button>
            </>
          ) : (
            <button 
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full mt-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnecting ? 'Conectando...' : 'Conectar Billetera'}
            </button>
          )}
        </div>
      </div>
      </nav>
    </div>
  );
};

export default Navbar;
