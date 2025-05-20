import { Link } from 'react-router-dom';
import { nftData } from '../data/nftData';
import { MediaRenderer } from 'thirdweb/react';
import { client } from '../main';

const NFTList = () => {
  return (
    <div className="nft-list-container">
      {nftData.map((nft) => (
        <Link
          key={nft.id}
          to={`/nft/${nft.id}`}
          className="nft-list-item"
        >
          <div className="nft-list-thumbnail">
            <MediaRenderer
              client={client}
              src={nft.image}
              alt={nft.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="nft-list-name-container">
            <span className="nft-list-name">
              {nft.name}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default NFTList;
