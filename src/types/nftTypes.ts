/**
 * Tipos para los datos de NFTs en la aplicación
 */

export interface NftAttribute {
  trait_type: string;
  value: string | number;
  display_type?: string;
  max_value?: number;
  trait_count?: number;
  order?: number;
}

export interface NftCreator {
  address: string;
  username?: string;
  verified?: boolean;
  profile_img_url?: string;
  config?: string;
}

export interface NftCollection {
  name: string;
  slug: string;
  external_url: string;
  banner_image_url?: string;
  description?: string;
  created_date?: string;
  stats?: CollectionStats;
}

export interface CollectionStats {
  total_volume: number;
  total_supply: number;
  num_owners: number;
  floor_price: number;
  floor_price_symbol: string;
}

export interface NftSale {
  total_price: string;
  payment_token: {
    symbol: string;
    decimals: number;
    usd_price: string;
  };
  transaction: {
    id: string;
    timestamp: string;
  };
}

export interface NftData {
  // Identificación
  id: string;
  token_id: string;
  name: string;
  description: string;
  external_url?: string;
  permalink?: string;
  price: string;
  currencySymbol: string;
  
  // Media
  image_url: string;
  image_preview_url?: string;
  image_thumbnail_url?: string;
  image_original_url?: string;
  animation_url?: string;
  animation_original_url?: string;
  
  // Contrato y cadena
  asset_contract: {
    address: string;
    name: string;
    symbol: string;
    schema_name: 'ERC721' | 'ERC1155';
    description?: string;
    external_link?: string;
    image_url?: string;
  };
  
  // Colección
  collection?: NftCollection;
  
  // Propiedades
  owner?: {
    user?: {
      username?: string;
    };
    profile_img_url?: string;
    address: string;
    config: string;
  };
  creator?: NftCreator;
  
  // Atributos
  traits: NftAttribute[];
  
  // Listado y ventas
  last_sale?: NftSale;
  sell_orders?: Array<{
    current_price: string;
    payment_token_contract: {
      symbol: string;
      decimals: number;
      usd_price: string;
    };
  }>;
  
  // Fechas
  transfer_fee_payment_token?: any;
  transfer_fee?: string | null;
  
  // Metadata
  background_color?: string | null;
  external_link?: string | null;
  token_metadata?: string;
  is_nsfw?: boolean;
  
  // Estadísticas de la colección
  collection_stats?: {
    one_day_volume: number;
    one_day_change: number;
    one_day_sales: number;
    one_day_average_price: number;
    seven_day_volume: number;
    seven_day_change: number;
    seven_day_sales: number;
    seven_day_average_price: number;
    thirty_day_volume: number;
    thirty_day_change: number;
    thirty_day_sales: number;
    thirty_day_average_price: number;
    total_volume: number;
    total_supply: number;
    count: number;
    num_owners: number;
    average_price: number;
    num_reports: number;
    market_cap: number;
    floor_price: number;
  };
}

// Tipos para las respuestas de la API
export interface NftApiResponse {
  nfts: NftData[];
  next: string | null;
  previous: string | null;
}

// Tipos para los filtros de búsqueda
export interface NftFilterOptions {
  owner?: string;
  collection?: string;
  collection_slug?: string;
  order_by?: 'sale_date' | 'sale_count' | 'sale_price';
  order_direction?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
  include_orders?: boolean;
}

// Tipos para los eventos de NFT
export interface NftEvent {
  id: number;
  asset_id: number;
  event_type: 'created' | 'successful' | 'cancelled' | 'bid_entered' | 'bid_withdrawn' | 'transfer' | 'approve';
  date: string;
  auction_type: 'dutch' | 'english' | 'min_price' | null;
  total_price: string;
  payment_token: {
    symbol: string;
    address: string;
    decimals: number;
    eth_price: string;
    usd_price: string;
  };
  transaction: {
    id: string;
    timestamp: string;
  };
  from_account: {
    user: {
      username: string;
    };
    profile_img_url: string;
    address: string;
    config: string;
  };
  to_account: {
    user: {
      username: string;
    };
    profile_img_url: string;
    address: string;
    config: string;
  } | null;
  owner_account: {
    user: {
      username: string;
    };
    profile_img_url: string;
    address: string;
    config: string;
  } | null;
  is_private: boolean;
}

// Tipos para las ofertas de NFT
export interface NftOffer {
  created_date: string;
  closing_date: string | null;
  closing_extendable: boolean;
  expiration_time: number;
  listing_time: number;
  order_hash: string | null;
  current_price: string;
  current_bounty: string;
  auction_type: string | null;
  side: number;
  order_type: string;
  cancelled: boolean;
  finalized: boolean;
  marked_invalid: boolean;
  approved_on_chain: boolean;
  maker: {
    user: {
      username: string | null;
    } | null;
    profile_img_url: string;
    address: string;
    config: string;
  };
  taker: {
    user: {
      username: string | null;
    } | null;
    profile_img_url: string;
    address: string;
    config: string;
  } | null;
  maker_fees: Array<{
    account: {
      user: {
        username: string | null;
      } | null;
      profile_img_url: string;
      address: string;
      config: string;
    };
    basis_points: string;
  }>;
  payment_token_contract: {
    id: number;
    symbol: string;
    address: string;
    image_url: string;
    name: string;
    decimals: number;
    eth_price: string;
    usd_price: string;
  };
  asset: {
    id: number;
    token_id: string;
    name: string;
    image_url: string;
    is_presale: boolean;
  };
  asset_bundle: any;
}

// Tipos para los precios de tokens
export interface TokenPrice {
  symbol: string;
  price: number;
  decimals: number;
  timestamp: string;
}
