import { Suspense, lazy, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingPage from './components/LoadingPage';
import NFTList from './components/NFTList';
import NFTDetail from './components/NFTDetail';
import Navbar from './components/Navbar';
import ParticlesBackground from './components/ParticlesBackground';
import { Toaster } from 'react-hot-toast';

// Lazy load heavy components
const AiAssistant = lazy(() => import('./pages/AiAssistant'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-900">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
  </div>
);

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  // Mostrar el Navbar incluso durante la carga
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800">
        <Navbar />
        <LoadingPage onLoadingComplete={handleLoadingComplete} />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800">
        <ParticlesBackground />
        <Navbar />
        
        <header className="relative z-10 w-full pt-16 pb-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-transparent to-transparent">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex flex-col items-center justify-center mb-6">
              <img 
                src="https://petgascoin.com/wp-content/uploads/2025/05/UCA-logo-fondo-blanco-horizontal-1-scaled-e1746841493573.png" 
                alt="MACQ Logo" 
                className="h-20 mb-6"
                style={{
                  filter: 'drop-shadow(0 0 10px rgba(168, 85, 247, 0.5))'
                }}
              />
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                NFT Boutique Marketplace
              </h1>
              <h2 className="text-xl md:text-2xl text-gray-300 mb-6">
                Arte Eterno Collection - MACQ
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Descubre y colecciona obras de arte digital únicas en la blockchain. 
                Cada pieza es un token no fungible (NFT) que representa la propiedad digital verificable.
              </p>
            </div>
          </div>
        </header>

        <main className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<NFTList />} />
                <Route path="/nft/:id" element={
                  <ErrorBoundary fallback={
                    <div className="text-center py-10">
                      <h2 className="text-2xl font-bold text-red-400 mb-4">Error loading NFT</h2>
                      <p className="text-gray-300">The NFT could not be loaded. It may have been moved or deleted.</p>
                    </div>
                  }>
                    <NFTDetail />
                  </ErrorBoundary>
                } />
                <Route 
                  path="/ai-assistant" 
                  element={
                    <ErrorBoundary>
                      <AiAssistant />
                    </ErrorBoundary>
                  } 
                />
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </Suspense>
          </div>
        </main>

      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 border-t border-gray-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <img 
                src="/macq_logo_black.png" 
                alt="MACQ Logo" 
                className="h-10 w-auto" 
              />
              <span className="text-lg font-semibold text-white">Museo de Arte Contemporáneo de Quintana Roo</span>
            </div>
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} MACQ Marketplace. Todos los derechos reservados.
            </p>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-700 text-center">
            <p className="text-sm text-gray-400">
              Explora nuestra colección de arte digital en la blockchain de Polygon.
            </p>
          </div>
        </div>
      </footer>
      
        <Toaster 
          position="bottom-right" 
          toastOptions={{
            style: {
              background: '#1f2937',
              color: '#fff',
              border: '1px solid #4b5563',
            },
          }}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;
