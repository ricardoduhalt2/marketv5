import * as React from 'react';
import { useState, useEffect } from 'react';
import type { NftData } from '../types';
import { ClaimButton, MediaRenderer } from 'thirdweb/react';
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
  const [showInfo, setShowInfo] = useState(false); // State for showing info

  const handleCopy = (text: string) => {
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

  const contractAddressToDisplay = nft.editionContractAddress;

  return (
    <div className="card-base group overflow-hidden h-[400px] flex flex-col"> {/* Reverted to original card-base class */}
      <div className="w-full overflow-hidden rounded-lg h-[300px]"> {/* Removed aspect-square, changed rounded-t-lg to rounded-lg, added h-[300px] */}
        <MediaRenderer
          client={client}
          src={nft.image}
          alt={nft.name}
          className="object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-110"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-slate-100 mb-2 truncate" title={nft.name}>
          {nft.name}
        </h3>
        <div className="mb-4">
          <p className="text-lg font-semibold text-cyan-400">
            {nft.price ? nft.price : 'N/A'} {nft.currencySymbol}
          </p>
          <div className="text-xs text-slate-400 mt-1 flex items-center" title={`Contract: ${contractAddressToDisplay}`}>
            <span>Contract: {contractAddressToDisplay.substring(0, 6)}...{contractAddressToDisplay.substring(contractAddressToDisplay.length - 4)}</span>
            <button
              onClick={(e) => { e.stopPropagation(); handleCopy(contractAddressToDisplay); }}
              className="ml-2 p-1 rounded bg-transparent hover:bg-transparent border border-slate-600 hover:border-slate-500 transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
              aria-label="Copy contract address"
            >
              {isCopied ? 'Copied!' : '📋'}
            </button>
          </div>
        </div>
        {showInfo && ( // Conditionally render info section
          <div className="flex-grow overflow-y-auto mb-4"> {/* Added overflow-y-auto and mb-4 */}
            <h4 className="text-lg font-bold text-slate-100 mb-2">Description</h4> {/* Changed to h4 */}
            {isLoadingDescription ? (
              <p className="text-slate-500 text-sm">Loading description...</p>
            ) : errorDescription ? (
              <p className="text-red-500 text-sm">{errorDescription}</p>
            ) : (
              <p className="text-slate-300 text-sm leading-relaxed">
                {fetchedDescription}
              </p>
            )}
          </div>
        )}
        <div className="flex-grow"></div> {/* Spacer */}
        <ClaimButton
          contractAddress={nft.editionContractAddress}
          chain={polygon}
          client={client}
          claimParams={{
            type: "ERC1155",
            tokenId: 0n,
            quantity: 1n,
          }}
          className="button-primary w-full mt-auto"
        >
          Claim NFT
        </ClaimButton>
        <button
          onClick={(e) => { // Add event parameter
            e.stopPropagation(); // Stop event propagation
            setShowInfo(!showInfo);
            console.log('Show Info toggled:', !showInfo); // Add console log
          }} // Toggle showInfo state
          className="crystal-button mt-2"
        >
          {showInfo ? 'Hide Info' : 'Show Info'} {/* Button text changes based on state */}
        </button>
      </div>
    </div>
  );
};

export default DropCard;
