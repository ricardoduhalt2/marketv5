import { useParams, Link } from 'react-router-dom';
import { allNftsData as nftData, type NftData } from '../types';
import type { NftMetadata } from '../types/nftMetadata';
import DropCard from './DropCard';
import { useActiveAccount, useConnect, MediaRenderer } from 'thirdweb/react';
import { createThirdwebClient } from 'thirdweb';
import { createWallet } from 'thirdweb/wallets';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';



// Media type detection is handled by checking file extensions

const NFTDetail = () => {
  const { id } = useParams();
  const [nft, setNft] = useState<NftData | undefined>(undefined);
  const [metadata, setMetadata] = useState<NftMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(true);
  const account = useActiveAccount();
  const { connect, isConnecting } = useConnect();

  // Fetch NFT data with error handling
  useEffect(() => {
    const fetchNftData = async () => {
      try {
        setIsLoading(true);
        // First try to find in local data
        let foundNft = nftData.find(n => n.id === id);
        
        // If not found, you could fetch from a contract here
        // Example:
        // if (!foundNft) {
        //   foundNft = await fetchNftFromContract(id);
        // }
        
        if (!foundNft) {
          throw new Error('NFT not found');
        }
        
        setNft(foundNft);
      } catch (error) {
        console.error('Error fetching NFT data:', error);
        toast.error('Failed to load NFT data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNftData();
  }, [id]);

  // Fetch NFT metadata with retry logic
  useEffect(() => {
    let isMounted = true;
    const MAX_RETRIES = 3;
    let retryCount = 0;

    const fetchMetadata = async () => {
      if (!nft?.tokenUri) {
        setIsLoadingMetadata(false);
        return;
      }

      try {
        const response = await fetch(nft.tokenUri, {
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (isMounted) {
          // Validate required fields
          if (!data.name || !data.image) {
            throw new Error('Invalid metadata: missing required fields');
          }
          
          setMetadata({
            ...data,
            // Ensure we have fallbacks for all required fields
            name: data.name || nft.name,
            description: data.description || nft.description || 'No description available.',
            image: data.image || nft.image,
            // Preserve any existing attributes and properties
            attributes: data.attributes || [],
            properties: data.properties || {}
          });
        }
      } catch (error) {
        console.error('Error fetching metadata:', error);
        
        // Retry logic for transient errors
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          console.log(`Retrying metadata fetch (attempt ${retryCount}/${MAX_RETRIES})...`);
          setTimeout(fetchMetadata, 1000 * retryCount); // Exponential backoff
          return;
        }
        
        if (isMounted) {
          toast.error('Failed to load NFT metadata. Some information may be limited.');
          // Fallback to basic metadata from nft data
          setMetadata({
            name: nft.name,
            description: nft.description || 'No description available.',
            image: nft.image,
            attributes: [],
            properties: {}
          });
        }
      } finally {
        if (isMounted) {
          setIsLoadingMetadata(false);
        }
      }
    };

    if (nft) {
      setIsLoadingMetadata(true);
      fetchMetadata();
    }

    return () => {
      isMounted = false;
    };
  }, [nft]);

  // Inicializar el cliente de thirdweb
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
          const wallet = createWallet('io.metamask');
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
      console.error('Error connecting wallet:', error);
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



  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 flex items-center justify-center">
        <div className="relative">
          {/* Outer glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
          
          {/* Main spinner */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Animated rings */}
            <div className="absolute w-full h-full rounded-full border-4 border-transparent border-t-blue-500 border-r-cyan-500 animate-spin-slow"></div>
            <div className="absolute w-5/6 h-5/6 rounded-full border-4 border-transparent border-b-purple-500 border-l-cyan-400 animate-spin-slow-reverse"></div>
            <div className="absolute w-2/3 h-2/3 rounded-full border-4 border-transparent border-t-purple-400 border-r-blue-400 animate-spin-slow"></div>
            
            {/* Center dot */}
            <div className="absolute w-4 h-4 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full animate-pulse"></div>
            
            {/* Floating particles */}
            <div className="absolute w-2 h-2 bg-blue-400 rounded-full animate-float1"></div>
            <div className="absolute w-1.5 h-1.5 bg-purple-400 rounded-full animate-float2"></div>
            <div className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-float3"></div>
          </div>
          
          {/* Loading text */}
          <p className="mt-8 text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-cyan-300 text-center animate-pulse">
            Cargando la experiencia digital...
          </p>
        </div>
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center p-8 max-w-2xl">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-3xl font-bold text-white mb-4">NFT Not Found</h1>
          <p className="text-gray-300 mb-8">The NFT you're looking for doesn't exist or has been moved.</p>
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <span className="hidden sm:inline">Back to Gallery</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>
      </div>
    );
  }

  // Reusable style for gradient text
  const gradientTextStyle = {
    background: 'linear-gradient(90deg, #ff6b00, #9d4edd, #4361ee, #4cc9f0, #9d4edd, #ff3c5f)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundSize: '300% 100%',
    animation: 'textGradientStroke 8s linear infinite',
    textShadow: '0 0 0.3px #ff6b00, 0 0 0.3px #9d4edd, 0 0 0.3px #4361ee, 0 0 0.3px #4cc9f0',
    WebkitTextStroke: '0.2px transparent'
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-4 sm:py-8 px-4 sm:px-6 lg:px-8 w-full flex justify-center">
      <div className="w-full max-w-[1600px] mx-auto px-0 sm:px-4 lg:px-8">
        {/* Back Button */}
        <div className="flex items-center mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-gray-300 hover:text-white transition-colors duration-200"
          >
            <span className="hidden sm:inline">Back to Gallery</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>

        {/* NFT Title Section */}
        <div className="relative mb-8 md:mb-12 text-center group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
          <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl p-4 md:p-8 overflow-hidden">
            <h1 
              className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4"
              style={gradientTextStyle}
            >
              {metadata?.name || nft.name}
            </h1>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-800/80 border border-gray-700/50">
              <span 
                className="text-sm font-medium"
                style={{
                  ...gradientTextStyle,
                  background: 'linear-gradient(90deg, #9d4edd, #4cc9f0, #9d4edd)',
                  backgroundSize: '200% 100%',
                  fontSize: '0.9rem',
                  WebkitTextStroke: '0.15px transparent'
                }}
              >
                Arte Eterno Collection • #{nft.id}
              </span>
            </div>
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-purple-500/20 rounded-full filter blur-3xl"></div>
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-cyan-500/20 rounded-full filter blur-3xl"></div>
          </div>
          <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/20 via-cyan-500/20 to-purple-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>
        </div>

        {/* NFT Content */}
        <div className="w-full max-w-full mx-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 w-full">
            {/* NFT Media */}
            <div className="group">
              <div className="relative h-[400px] md:h-[600px] w-full transform-gpu transition-all duration-700 hover:scale-[1.02] rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-gray-900 to-cyan-900/30"></div>
                <div className="relative h-full w-full flex items-center justify-center p-4 md:p-8">
                  {isLoadingMetadata ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <MediaRenderer
                        client={client}
                        src={metadata?.animation_url || nft.animation_url || metadata?.image || nft.image || ''}
                        alt={metadata?.name || nft.name || 'NFT'}
                        className="w-full h-full object-contain z-10 relative rounded-2xl"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain'
                        }}
                        requireInteraction
                        width="100%"
                        height="100%"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 rounded-2xl border border-gray-700/50 pointer-events-none"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-purple-500/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>
            </div>

            {/* NFT Details */}
            <div className="transform-gpu transition-all duration-500 hover:translate-y-[-5px] mt-6 md:mt-0 w-full h-full flex">
              <DropCard 
                nft={nft} 
                metadata={metadata}
                onConnectWallet={handleConnect}
                isConnected={!!account}
                isConnecting={isConnecting}
                isLoadingMetadata={isLoadingMetadata}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDetail;
