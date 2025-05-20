import { useParams } from 'react-router-dom';
import { nftData } from '../data/nftData';
import { client } from '../main';
import DropCard from './DropCard';
import { Link } from 'react-router-dom';
import { MediaRenderer } from 'thirdweb/react';

const NFTDetail = () => {
  const { id } = useParams();
  const nft = nftData.find(n => n.id === id);

  if (!nft) {
    return (
      <div className="nft-detail-error">
        <h2>NFT no encontrado</h2>
        <Link to="/" className="back-link">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div className="nft-detail-container">
      <div className="flex items-center justify-between mb-8">
        <Link to="/" className="back-link">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span>Back to list</span>
        </Link>
      </div>
      
      <div className="nft-title-container relative mb-12 text-center group hover:transform hover:scale-105 transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-purple-500/20 blur-xl group-hover:blur-2xl transition-all duration-500"></div>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-lg"></div>
        <div className="relative p-8 flex flex-col items-center gap-6">
          <h1 className="nft-detail-title">
            {nft.name}
          </h1>
          <div className="collection-badge">
            <span className="collection-badge-text">
              Arte Eterno Collection #{nft.id}
            </span>
          </div>
        </div>
        <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/20 via-cyan-500/20 to-purple-600/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>
      </div>

      <div className="nft-detail-content max-w-5xl mx-auto">
        <div className="nft-detail-grid">
          <div className="nft-detail-media group perspective">
            <div className="media-container transform-gpu transition-all duration-700 hover:scale-105 hover:[transform:rotateY(10deg)]">
              <MediaRenderer
                client={client}
                src={nft.image}
                alt={nft.name}
                className="w-full h-full object-cover rounded-xl shadow-2xl"
              />
              <div className="media-shine"></div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
          <div className="nft-detail-info transform-gpu transition-all duration-500 hover:translate-y-[-5px]">
            <DropCard nft={nft} client={client} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDetail;
