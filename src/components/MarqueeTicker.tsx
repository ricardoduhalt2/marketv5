import React, { useMemo } from 'react';
import './MarqueeTicker.css';

interface NftItem {
  id: string;
  name: string;
  artist: string;
}

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

  // Procesar los NFTs para eliminar duplicados y limpiar los nombres
  const processedItems = useMemo(() => {
    // Usar un Set para rastrear IDs únicos
    const uniqueIds = new Set<string>();
    const result: NftItem[] = [];

    nfts.forEach(nft => {
      // Limpiar el nombre para extraer solo el título sin el artista
      let cleanName = nft.name;
      if (nft.id === 'EVC') {
        cleanName = 'Entre la vida y el plástico';
      } else if (nft.id === 'CMV') {
        cleanName = 'C0mMzoVeRLoAD';
      }

      if (!uniqueIds.has(nft.id)) {
        uniqueIds.add(nft.id);
        result.push({
          id: nft.id,
          name: cleanName,
          artist: artistMap[nft.id] || 'Artista'
        });
      }
    });

    return result;
  }, [nfts]);

  // Crear una versión extendida para la animación continua
  const tickerItems = useMemo(() => {
    // Duplicar los elementos para permitir un desplazamiento continuo sin saltos
    return [...processedItems, ...processedItems];
  }, [processedItems]);

  return (
    <div className="w-full overflow-hidden">
      <div className="marquee-container">
        <div className="marquee-inner">
          <div className="marquee-gradient-left"></div>
          <div className="marquee-gradient-right"></div>
          
          <div className="marquee-content">
            {tickerItems.map((item, index) => (
              <div key={`${item.id}-${index}`} className="marquee-item group">
                <div className="marquee-item-content">
                  <span className="marquee-item-name" title={item.name}>
                    {item.name}
                  </span>
                  <span className="marquee-item-artist">
                    by {item.artist}
                  </span>
                </div>
                <div className="marquee-item-divider">•</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarqueeTicker;
