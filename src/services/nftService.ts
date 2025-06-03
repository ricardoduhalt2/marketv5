import { nftData } from '../data/nftData';
import type { NftData, NftAttribute, NftCreator, NftSale, CollectionStats } from '../types/nftTypes';

/**
 * Interfaz extendida para los datos de NFT locales
 */
interface LocalNftData {
  id: string;
  name: string;
  description: string;
  image: string;
  animation_url?: string;
  editionContractAddress: string;
  price: string;
  currencySymbol: string;
  splitContractAddress: string;
  tokenUri: string;
  attributes?: NftAttribute[];
  created_at?: string;
  last_sale?: NftSale;
  creator?: NftCreator;
  stats?: CollectionStats;
  owner?: {
    address: string;
    username?: string;
    verified?: boolean;
  };
}

/**
 * Mapea los datos locales de NFT a la interfaz NftData estándar
 */
function mapToNftData(localNft: LocalNftData): NftData {
  const nftData: NftData = {
    id: localNft.id,
    token_id: localNft.id,
    name: localNft.name,
    description: localNft.description,
    image_url: localNft.image,
    animation_url: localNft.animation_url,
    asset_contract: {
      address: localNft.editionContractAddress,
      name: localNft.name,
      symbol: localNft.currencySymbol,
      schema_name: 'ERC721',
      description: localNft.description
    },
    traits: localNft.attributes || [],
    owner: localNft.owner ? {
      address: localNft.owner.address,
      config: '',
      user: localNft.owner.username ? {
        username: localNft.owner.username
      } : undefined,
      profile_img_url: ''
    } : undefined,
    last_sale: localNft.last_sale,
    external_url: '',
    permalink: localNft.tokenUri,
    is_nsfw: false,
    token_metadata: localNft.tokenUri,
    sell_orders: localNft.price ? [{
      current_price: localNft.price,
      payment_token_contract: {
        symbol: localNft.currencySymbol,
        decimals: 18,
        usd_price: '0'
      }
    }] : [],
    // Add price and currencySymbol at the root level
    price: localNft.price,
    currencySymbol: localNft.currencySymbol
  };
  
  return nftData;
}

/**
 * Encuentra un NFT en el texto proporcionado
 * @param text - Texto de búsqueda (puede ser ID o nombre)
 * @returns NFT encontrado o null
 */
export const findNftInText = (text: string): NftData | null => {
  if (!text?.trim()) return null;
  
  const searchTerm = text.toLowerCase().trim();
  if (!searchTerm) return null;

  // Búsqueda exacta por ID
  const exactMatch = (nftData as unknown as LocalNftData[]).find(nft => 
    nft.id.toLowerCase() === searchTerm
  );
  if (exactMatch) return mapToNftData(exactMatch);

  // Búsqueda por nombre exacto
  const nameMatch = (nftData as unknown as LocalNftData[]).find(nft => 
    nft.name.toLowerCase() === searchTerm
  );
  if (nameMatch) return mapToNftData(nameMatch);

  // Búsqueda parcial en nombre
  const partialMatch = (nftData as unknown as LocalNftData[]).find(nft => 
    nft.name.toLowerCase().includes(searchTerm)
  );
  if (partialMatch) return mapToNftData(partialMatch);

  // Búsqueda en descripción
  const descriptionMatch = (nftData as unknown as LocalNftData[]).find(nft => 
    nft.description?.toLowerCase().includes(searchTerm)
  );
  if (descriptionMatch) return mapToNftData(descriptionMatch);

  // Búsqueda en atributos
  const attributeMatch = (nftData as unknown as LocalNftData[]).find(nft => 
    nft.attributes?.some(attr => 
      String(attr.value).toLowerCase().includes(searchTerm) ||
      attr.trait_type.toLowerCase().includes(searchTerm)
    )
  );

  return attributeMatch ? mapToNftData(attributeMatch) : null;
};

// Obtener los nombres de los NFTs disponibles
export const getAvailableNftNames = (): string[] => {
  return nftData.map(nft => nft.name);
};

// Encontrar el NFT más similar al texto proporcionado
export const findClosestNft = (query: string): string | null => {
  const names = getAvailableNftNames();
  const lowerQuery = query.toLowerCase();
  
  // Buscar coincidencias exactas primero
  const exactMatch = names.find(name => name.toLowerCase() === lowerQuery);
  if (exactMatch) return exactMatch;
  
  // Buscar coincidencias parciales
  const partialMatches = names.filter(name => 
    name.toLowerCase().includes(lowerQuery) || 
    lowerQuery.includes(name.toLowerCase())
  );
  
  return partialMatches.length > 0 ? partialMatches[0] : null;
};

// Obtener el contexto de la colección
export const getCollectionContext = (): string => {
  return nftData
    .map(nft => `- ${nft.name} (${nft.id}): ${nft.description || 'Sin descripción'}`)
    .join('\n');
};

/**
 * Obtiene información detallada de un NFT en formato de texto
 * @param nft - Datos del NFT
 * @returns Cadena formateada con la información del NFT
 */
export const getNftInfo = (nft: NftData | null): string => {
  if (!nft) return '❌ No se encontró información sobre este NFT.';
  
  const infoLines: string[] = [
    `🎨 *${nft.name}*`,
    `🆔 ${nft.token_id}`,
    '',
    nft.description || 'Sin descripción',
  ];

  // Agregar precio si está disponible
  if (nft.sell_orders?.[0]?.current_price) {
    const price = nft.sell_orders[0].current_price;
    const symbol = nft.sell_orders[0].payment_token_contract.symbol;
    infoLines.push('', `💰 *Precio actual:* ${price} ${symbol}`);
  }

  // Agregar datos de última venta si están disponibles
  if (nft.last_sale?.payment_token) {
    const salePrice = nft.last_sale.payment_token.usd_price;
    const saleCurrency = nft.last_sale.payment_token.symbol;
    infoLines.push(`💱 *Última venta:* ${salePrice} ${saleCurrency}`);
  }

  // Agregar atributos si existen
  if (nft.traits?.length) {
    infoLines.push('', '🔍 *Atributos:*');
    nft.traits.forEach(attr => {
      infoLines.push(`• *${attr.trait_type}:* ${attr.value}`);
    });
  }

  // Agregar información del creador
  if (nft.creator) {
    infoLines.push('', '👨\u200d🎨 *Creador:*');
    if (nft.creator.username) {
      infoLines.push(`• Nombre: ${nft.creator.username}`);
    }
    infoLines.push(`• Dirección: ${shortenAddress(nft.creator.address)}`);
  }

  // Agregar enlaces útiles
  if (nft.asset_contract?.address) {
    infoLines.push(
      '',
      '🔗 *Enlaces útiles:*',
      `• Ver en OpenSea: https://opensea.io/assets/${nft.asset_contract.address}/${nft.token_id}`,
      `• Ver en Rarible: https://rarible.com/token/${nft.asset_contract.address}:${nft.token_id}`
    );
  }

  return infoLines.join('\n');
};

/**
 * Formatea una dirección de billetera para mostrarla de manera más legible
 */
function shortenAddress(address: string, start = 6, end = 4): string {
  if (!address) return 'Desconocido';
  return `${address.substring(0, start)}...${address.substring(address.length - end)}`;
}
