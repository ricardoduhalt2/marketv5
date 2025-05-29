import type { NftData } from '../types';
import type { NftMetadata, NftAttribute } from '../types/nftMetadata';
import { useState } from 'react';
import './DropCard.css';
import './NFTDetailCard.css';
import { useActiveAccount, useSendTransaction } from 'thirdweb/react';
import { toWei } from 'thirdweb';
import { polygon } from 'thirdweb/chains';
import { toast } from 'react-hot-toast';
import { createThirdwebClient } from 'thirdweb';
import { encodeFunctionData } from 'viem';

interface DropCardProps {
  nft: NftData;
  metadata: NftMetadata | null;
  onConnectWallet: () => Promise<void>;
  isConnected: boolean;
  isConnecting: boolean;
  isLoadingMetadata: boolean;
}

const DropCard: React.FC<DropCardProps> = ({ 
  nft, 
  metadata,
  onConnectWallet, 
  isConnected,
  isLoadingMetadata
}) => {
  const [isMinting, setIsMinting] = useState(false);
  const account = useActiveAccount();
  const { mutate: sendTransaction } = useSendTransaction();
  
  // Contract details
  const contractAddress = nft.editionContractAddress as `0x${string}`;
  const chain = polygon;
  
  // Create a thirdweb client
  const client = createThirdwebClient({
    clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID || 'YOUR_CLIENT_ID',
  });
  
  // Contract ABI for the mint function
  const contractABI = [
    {
      inputs: [
        { name: 'to', type: 'address' },
        { name: 'quantity', type: 'uint256' }
      ],
      name: 'mint',
      outputs: [],
      stateMutability: 'payable',
      type: 'function'
    }
  ] as const;

  const handleMint = async () => {
    try {
      // First ensure wallet is connected
      if (!isConnected) {
        try {
          await onConnectWallet();
          // Wait a moment for the wallet to connect
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error('Error connecting wallet:', error);
          toast.error('Please connect your wallet to continue');
          return;
        }
      }

      if (!account?.address) {
        throw new Error('No connected account found');
      }

      setIsMinting(true);

      const toastId = toast.loading('Preparing transaction...');
      
      try {
        // Encode the function data
        const data = encodeFunctionData({
          abi: contractABI,
          functionName: 'mint',
          args: [account.address, 1n] // to, quantity (using BigInt literal)
        });

        // Prepare the transaction
        const transaction = {
          to: contractAddress as `0x${string}`,
          value: toWei(nft.price || '0'), // price in wei
          data,
          chain,
          client
        } as const;
        
        // Send the transaction
        const result = await sendTransaction(transaction);
        
        // Log the transaction hash
        console.log('Transaction result:', result);
        
        toast.success('Connecting Wallet', { 
          id: toastId,
          duration: 5000 
        });
        
        console.log('Mint transaction:', result);
        
      } catch (error) {
        console.error('Error in mint transaction:', error);
        toast.error(
          error instanceof Error 
            ? error.message.includes('user rejected')
              ? 'Transaction was rejected'
              : error.message
            : 'Failed to mint NFT', 
          { id: toastId }
        );
      }
    } catch (error) {
      console.error('Error in mint process:', error);
      toast.error('Failed to process mint request');
    } finally {
      setIsMinting(false);
    }
  };

  // Extract properties from metadata or use defaults
  const nftDescription = metadata?.description || nft.description || 'No description available.';
  const nftProperties = metadata?.properties || {};
  const nftAttributes: NftAttribute[] = metadata?.attributes || [];

  // Find specific attributes
  const findAttribute = (traitType: string): string | number | undefined => {
    const attr = nftAttributes.find((attr: NftAttribute) => attr.trait_type === traitType);
    return attr?.value;
  };

  // Default values with fallbacks
  const nftSize = (nftProperties.size || findAttribute('size') || 'Varies') as string;
  const nftFormat = (nftProperties.format || findAttribute('format') || 'Image') as string;
  const nftBlockchain = (nftProperties.blockchain || 'Polygon') as string;
  const nftStandard = (nftProperties.standard || findAttribute('standard') || 'ERC-1155') as string;

  return (
    <div className="nft-detail-card">
      <div className="nft-detail-content">
        <div className="detail-section">
          <h2 className="text-2xl font-bold mb-2">
            Detalles de la Obra
          </h2>
          <p className="text-gray-300">Información detallada sobre esta pieza única de arte digital.</p>
        </div>

        {/* Descripción */}
        <div className="detail-section">
          <h3 className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Descripción
          </h3>
          {isLoadingMetadata ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
            <p className="text-gray-300 whitespace-pre-line break-words">{nftDescription}</p>
          </div>
          )}
        </div>

        {/* Detalles Técnicos */}
        <div className="detail-section">
          <h3 className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Detalles Técnicos
          </h3>
          {isLoadingMetadata ? (
            <div className="attributes-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="attribute-item">
                <span className="h-4 bg-gray-700 rounded w-1/3 mb-1 inline-block"></span>
                <span className="h-4 bg-gray-700 rounded w-2/3 inline-block"></span>
              </div>
            ))}
          </div>
          ) : (
            <div className="attributes-grid">
            <div className="attribute-item">
              <span>Tamaño</span>
              <span>{nftSize}</span>
            </div>
            <div className="attribute-item">
              <span>Formato</span>
              <span>{nftFormat.toUpperCase()}</span>
            </div>
              <div className="attribute-item">
              <span>Blockchain</span>
              <span>{nftBlockchain}</span>
            </div>
            <div className="attribute-item">
              <span>Estándar</span>
              <span>{nftStandard}</span>
            </div>
            </div>
          )}
        </div>

        {/* Additional Attributes */}
        {!isLoadingMetadata && nftAttributes.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Atributos
            </h3>
            <div className="flex flex-wrap gap-2">
              {nftAttributes.map((attr: NftAttribute, index: number) => (
                <div key={`${attr.trait_type}-${index}`} className="bg-gray-700/50 px-3 py-1 rounded-full text-sm">
                  <span className="text-blue-300">{attr.trait_type}:</span> 
                  <span className="ml-1 text-white">{String(attr.value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botón de Compra */}
        <div className="detail-section mt-8">
          <button
            onClick={handleMint}
            disabled={isMinting || isLoadingMetadata}
            className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
              isMinting || isLoadingMetadata
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-600 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/30 hover:shadow-cyan-500/20'
            }`}
          >
            {isMinting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              </span>
            ) : isConnected ? (
              'Adquirir por ' + nft.price + ' ' + nft.currencySymbol
            ) : (
              'Conectar Billetera'
            )}
          </button>
        </div>
        
        {!isConnected && (
          <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
            <p className="text-sm text-blue-300 text-center">
              Necesitas conectar tu billetera para comprar este NFT
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DropCard;
