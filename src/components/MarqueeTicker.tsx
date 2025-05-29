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
    <div className="w-full overflow-hidden">
      <div className="marquee-container">
        <div className="marquee-inner">
          <div className="marquee-gradient-left"></div>
          <div className="marquee-gradient-right"></div>
          
          <div className="marquee-content">
            {duplicatedItems.map((item, index) => (
              <div key={`${item.id}-${index}`} className="marquee-item group">
                <span className="text-blue-400 group-hover:text-cyan-300 transition-colors duration-300">▶</span>
                <span className="marquee-item-text bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-purple-300 transition-all duration-300">
                  {item.text}
                </span>
                <span className="text-purple-400 group-hover:text-pink-300 transition-colors duration-300">◀</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarqueeTicker;
