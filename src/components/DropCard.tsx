import * as React from 'react';
import { useState, useEffect } from 'react';
import type { NftData } from '../types';
import { ClaimButton } from 'thirdweb/react';
import { type ThirdwebClient, getContract } from 'thirdweb';
import { polygon } from 'thirdweb/chains';
import { getNFT } from "thirdweb/extensions/erc1155";

interface DropCardProps {
  nft: NftData;
  client: ThirdwebClient;
}

const DropCard: React.FC<DropCardProps> = ({ nft, client }) => {
  const [fetchedDescription, setFetchedDescription] = useState<string | undefined>(undefined);
  const [isLoadingDescription, setIsLoadingDescription] = useState<boolean>(true);
  const [errorDescription, setErrorDescription] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = (text: string | undefined) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  useEffect(() => {
    const fetchNftDescription = async () => {
      if (!nft.editionContractAddress || !client) {
        setIsLoadingDescription(false);
        return;
      }
      setIsLoadingDescription(true);
      setErrorDescription(null);
      try {
        const contract = getContract({
          client,
          chain: polygon,
          address: nft.editionContractAddress,
        });
        const nftMetadata = await getNFT({
          contract,
          tokenId: 0n,
        });
        setFetchedDescription(nftMetadata.metadata.description || "No description available.");
      } catch (error) {
        console.error("Error fetching NFT description:", error);
        setErrorDescription("Could not load description.");
      } finally {
        setIsLoadingDescription(false);
      }
    };

    fetchNftDescription();
  }, [nft.editionContractAddress, client]);

  return (
    <div className="card-interactive group">
      <div className="card-content">
        <div className="info-section">
          {isLoadingDescription ? (
            <div className="loading-spinner" />
          ) : errorDescription ? (
            <div className="error-message">{errorDescription}</div>
          ) : (
            <div className="description-container">
              <p className="description-text">
                {fetchedDescription || nft.description}
              </p>
              <button
                onClick={() => handleCopy(nft.description)}
                className="crystal-button mt-4 group-hover:scale-105 transition-transform"
              >
                {isCopied ? "¡Copiado!" : "Copiar descripción"}
              </button>
            </div>
          )}
        </div>

        <div className="nft-metadata">
          <div className="metadata-grid">
            <div className="metadata-item">
              <span className="metadata-label">Precio</span>
              <span className="metadata-value">{nft.price} {nft.currencySymbol}</span>
            </div>
            <div className="metadata-item">
              <span className="metadata-label">Contract</span>
              <span 
                className="metadata-value contract-address" 
                onClick={() => {
                  handleCopy(nft.editionContractAddress);
                  const el = document.createElement('div');
                  el.className = 'copy-feedback';
                  el.textContent = '¡Copiado!';
                  document.body.appendChild(el);
                  setTimeout(() => el.remove(), 2000);
                }}
              >
                {nft.editionContractAddress.slice(0, 6)}...{nft.editionContractAddress.slice(-4)}
              </span>
            </div>
          </div>
        </div>

        <div className="claim-section">
          <ClaimButton
            contractAddress={nft.editionContractAddress}
            chain={polygon}
            client={client}
            claimParams={{
              type: "ERC1155",
              tokenId: 0n,
              quantity: 1n
            }}
            className="claim-button"
          >
            Mint NFT
          </ClaimButton>
        </div>
      </div>
      
      <div className="card-effects">
        <div className="card-glow absolute -inset-1 bg-gradient-to-r from-purple-600/30 via-cyan-500/30 to-purple-600/30 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
        <div className="card-shine absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
      </div>
    </div>
  );
};

export default DropCard;
