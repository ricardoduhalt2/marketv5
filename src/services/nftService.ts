import { nftData } from '../data/nftData';

// Definir el tipo para los datos del NFT
export interface NftData {
  id: string; // Unique identifier (e.g., SYMBOL or contract address)
  name: string;
  description?: string; // Will be fetched from tokenUri later if needed
  image: string; // HTTP URL for the NFT's primary image/media
  animation_url?: string; // Optional HTTP URL for animation/video
  editionContractAddress: string; // Smart contract address of the ERC1155 Edition Drop
  price?: string; // Formatted price string, e.g., "10 MATIC"
  currencySymbol?: string; // e.g., "MATIC" / "POL"
  splitContractAddress: string; // Smart contract address of the associated Split contract
  tokenUri: string; // IPFS or HTTP URI for metadata (required)
}

// Función para encontrar un NFT mencionado en el texto
export const findNftInText = (text: string): NftData | null => {
  if (!text) return null;
  
  const lowerText = text.toLowerCase().trim();
  
  // 1. Buscar por ID exacto (ej: "CHIDO")
  const nftById = nftData.find(nft => 
    nft.id.toLowerCase() === lowerText || 
    lowerText.includes(nft.id.toLowerCase())
  );
  
  if (nftById) return nftById;
  
  // 2. Buscar por nombre exacto (ignorando mayúsculas)
  const nftByName = nftData.find(nft => 
    lowerText.includes(nft.name.toLowerCase()) ||
    nft.name.toLowerCase().includes(lowerText)
  );
  
  if (nftByName) return nftByName;
  
  // 3. Buscar coincidencia exacta con nombres que contienen dos puntos
  for (const nft of nftData) {
    if (nft.name.includes(':')) {
      const [mainName] = nft.name.split(':');
      const cleanMainName = mainName.trim().toLowerCase();
      
      if (lowerText.includes(cleanMainName) || cleanMainName.includes(lowerText)) {
        return nft;
      }
    }
  }
  
  // 4. Buscar IDs de NFT en el texto (3-5 letras mayúsculas)
  const idMatch = lowerText.match(/\b([a-z]{3,5})\b/);
  if (idMatch) {
    const nftId = idMatch[1].toUpperCase();
    const nft = nftData.find(n => n.id === nftId);
    if (nft) return nft;
  }
  
  // 5. Si no se encontró coincidencia exacta, buscar por palabras clave
  const commonWords = ['el', 'la', 'los', 'las', 'de', 'del', 'y', 'en', 'a', 'the', 'and', 'of', 'in', 'on', 'at', 'what', 'price', 'precio', 'costo', 'cuesta', 'cuanto', 'cuesta', 'cuestan', 'dime', 'sobre'];
  const words = lowerText.split(/[\s:]+/).filter(word => 
    word.length > 2 && 
    !commonWords.includes(word) &&
    !/^[0-9.,]+$/.test(word)
  );
  
  // Buscar por similitud de palabras clave
  let bestMatch: NftData | null = null;
  let bestScore = 0;
  
  for (const nft of nftData) {
    let score = 0;
    const nftNameLower = nft.name.toLowerCase();
    
    for (const word of words) {
      if (nftNameLower.includes(word)) {
        // Dar más peso a coincidencias al inicio del nombre
        if (nftNameLower.startsWith(word)) {
          score += 3;
        } else {
          score += 1;
        }
      }
    }
    
    // Dar un pequeño bonus si el ID coincide con alguna palabra
      if (words.some(word => nft.id.toLowerCase() === word)) {
        score += 2;
      }
    
    if (score > bestScore) {
      bestScore = score;
      bestMatch = nft;
    }
  }
  
  // Solo devolver la mejor coincidencia si tiene un puntaje razonable
  return bestScore > 0 ? bestMatch : null;
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

// Obtener información detallada de un NFT
export const getNftInfo = (nft: NftData, formatPrice: (price: string, symbol: string) => string): string => {
  const priceInfo = nft.price && nft.currencySymbol 
    ? `Precio: ${formatPrice(nft.price, nft.currencySymbol)}` 
    : 'Precio no disponible';
    
  return `Información sobre ${nft.name} (${nft.id}):\n` +
         `Descripción: ${nft.description || 'No disponible'}\n` +
         `${priceInfo}\n` +
         `Contrato: ${nft.editionContractAddress || 'No disponible'}`;
};
