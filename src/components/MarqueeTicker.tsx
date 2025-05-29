import React from 'react';
import './MarqueeTicker.css';

interface MarqueeTickerProps {
  nfts: Array<{
    id: string;
    name: string;
  }>;
}

const MarqueeTicker: React.FC<MarqueeTickerProps> = ({ nfts }) => {
  // Mapeo de IDs de NFT a nombres de artista
  const artistMap: {[key: string]: string} = {
    'TEM': 'Ms. Cosmic',
    'GCC': 'Pinche Chucho',
    'EVC': 'Daughter of the Son',
    'CMV': 'Pinche Chucho',
    'BBB': 'Daveed Benjamin',
    'IVT': 'ONA AOÉRA',
    'YSL': 'Tania Cuevas Martinez',
    'PSA': 'Pinche Chucho',
    'PLL': 'Pinche Chucho',
    'MOL': 'Char Puravida',
    'HTC': 'Jolted',
    'FLC': 'IGLI',
    'SWH': 'Fractalicia',
    'RAI': 'Samu Gaia',
    'TRG': 'Jimi Cohen',
    'CHIDO': 'Ricardo Duhalt'
  };

  // Crear una lista de elementos para la marquesina
  const tickerItems = nfts.flatMap(nft => ({
    id: nft.id,
    text: `${nft.name} - ${artistMap[nft.id] || 'Artista'}`
  }));

  // Duplicar los elementos para un desplazamiento continuo
  const duplicatedItems = [...tickerItems, ...tickerItems];

  return (
    <div className="marquee-container">
      <div className="marquee-inner">
        <div className="marquee-gradient-left"></div>
        <div className="marquee-gradient-right"></div>
        
        <div className="marquee-content">
          {duplicatedItems.map((item, index) => (
            <div key={`${item.id}-${index}`} className="marquee-item">
              <span>▶</span>
              <span className="marquee-item-text">{item.text}</span>
              <span>◀</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarqueeTicker;
