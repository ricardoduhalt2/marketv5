import { Link } from 'react-router-dom';
import { allNftsData as nftData } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import type { NftData } from '../types';
import { toast } from 'react-hot-toast';

// Define animation variants for the list items
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    },
  }),
};

const NFTList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nfts, setNfts] = useState<NftData[]>([]);

  // Fetch NFTs with error handling
  const fetchNFTs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would fetch from an API here
      // const response = await fetch('/api/nfts');
      // const data = await response.json();
      // setNfts(data);
      
      setNfts(nftData);
    } catch (err) {
      console.error('Error fetching NFTs:', err);
      setError('Failed to load NFTs. Please try again later.');
      toast.error('Failed to load NFTs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchNFTs();
  }, [fetchNFTs]);

  // Star animation effect
  useEffect(() => {
    const createStar = () => {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDuration = `${Math.random() * 3 + 2}s`;
      document.querySelector('.stars-container')?.appendChild(star);
      
      // Remover estrellas después de que terminen la animación
      setTimeout(() => {
        star.remove();
      }, 5000);
    };

    // Crear estrellas de fondo
    const starInterval = setInterval(createStar, 300);
    
    // Crear ovnis
    const createUFO = () => {
      const ufo = document.createElement('div');
      ufo.className = 'ufo';
      ufo.style.left = `${-50}px`;
      ufo.style.top = `${Math.random() * 80}%`;
      ufo.style.animationDuration = `${Math.random() * 10 + 10}s`;
      document.querySelector('.ufos-container')?.appendChild(ufo);
      
      // Remover ovnis después de que terminen la animación
      setTimeout(() => {
        ufo.remove();
      }, 15000);
    };

    // Crear ovnis periódicamente
    const ufoInterval = setInterval(createUFO, 8000);
    
    return () => {
      clearInterval(starInterval);
      clearInterval(ufoInterval);
    };
  }, []);

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
          <p className="mt-4 text-gray-300">Loading NFT collection...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="text-center p-6 max-w-md mx-auto bg-gray-800/50 rounded-lg">
          <div className="text-red-400 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={fetchNFTs}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Render empty state
  if (nfts.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="text-center">
          <div className="text-5xl mb-4">🖼️</div>
          <h2 className="text-xl font-bold text-white mb-2">No NFTs found</h2>
          <p className="text-gray-300">There are no NFTs in the collection yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 sm:py-8 overflow-x-hidden overflow-y-auto">
      {/* Fondos animados */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="stars-container absolute inset-0"></div>
        <div className="ufos-container absolute inset-0"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 min-h-full">
        <div className="flex justify-center mb-12">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-200 group-hover:duration-200 animate-tilt"></div>
            <h2 className="relative px-6 py-3 bg-gradient-to-r from-purple-900/80 to-blue-900/80 backdrop-blur-sm text-2xl md:text-3xl font-bold text-center rounded-xl border border-purple-500/30 shadow-xl shadow-purple-500/10 overflow-hidden group">
              <span className="bg-gradient-to-r from-blue-300 via-purple-400 to-pink-300 bg-clip-text text-transparent bg-300% animate-gradient">
                Arte Eterno Collection
              </span>
            </h2>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
          <AnimatePresence>
            {nfts.map((nft, index) => (
              <motion.div
                key={nft.id}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                layout
              >
                <Link to={`/nft/${nft.id}`} className="block">
                  <div className="relative overflow-hidden rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 h-full flex flex-col group" style={{ minHeight: '400px' }}>
                    {/* Imagen del NFT */}
                    <div className="h-64 overflow-hidden">
                      <img
                        src={nft.image}
                        alt={nft.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          // Fallback in case the image fails to load
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = 'https://via.placeholder.com/400';
                        }}
                      />
                      
                      {/* Efecto de brillo al hacer hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    
                    {/* Información del NFT */}
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-white mb-1 truncate">{nft.name}</h3>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">
                          {nft.name.split(' by ')[1] || 'Artista'}
                        </span>
                        <span className="text-sm font-medium bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                          {nft.price} {nft.currencySymbol}
                        </span>
                      </div>
                    </div>
                    
                    {/* Badge de colección */}
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full border border-white/10">
                      #{nft.id}
                    </div>
                    
                    {/* Efecto de borde brillante */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-400/30 transition-all duration-500 pointer-events-none"></div>
                  </div>
                  
                  {/* Efecto de resplandor */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500 -z-10"></div>
                </Link>
                
                {/* Botón de acción rápida */}
                <button className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-blue-500/30">
                  Ver detalles
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Estilos para las animaciones */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
          25% { transform: translateX(5px) translateY(-5px) rotate(2deg); }
          50% { transform: translateX(0) translateY(-10px) rotate(0deg); }
          75% { transform: translateX(-5px) translateY(-5px) rotate(-2deg); }
        }
        
        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 5px 1px rgba(255, 255, 255, 0.8);
          animation: twinkle 3s infinite;
        }
        
        .ufo {
          position: absolute;
          width: 40px;
          height: 20px;
          background: rgba(147, 51, 234, 0.3);
          border-radius: 50%;
          animation: float 20s linear infinite;
          box-shadow: 0 0 15px 5px rgba(147, 51, 234, 0.3);
        }
        
        .ufo::before {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 5px;
          right: 5px;
          height: 10px;
          background: rgba(96, 165, 250, 0.3);
          border-radius: 50%;
          filter: blur(5px);
        }
        
        .ufo::after {
          content: '🛸';
          position: absolute;
          top: -15px;
          left: 0;
          right: 0;
          text-align: center;
          font-size: 24px;
          filter: drop-shadow(0 0 5px rgba(96, 165, 250, 0.8));
        }
      `}</style>
    </div>
  );
};

export default NFTList;
