export interface NftAttribute {
  trait_type: string;
  value: string | number;
}

export interface NftMetadata {
  // Required fields
  name: string;
  description: string;
  image: string;
  
  // Optional standard fields
  external_url?: string;
  animation_url?: string;
  background_color?: string;
  youtube_url?: string;
  
  // Attributes
  attributes?: NftAttribute[];
  
  // Properties (OpenSea and other marketplaces)
  properties?: {
    // Common properties
    category?: string;
    files?: Array<{
      uri: string;
      type: string;
      [key: string]: any;
    }>;
    // Additional properties
    [key: string]: any;
  };
  
  // Any other metadata
  [key: string]: any;
}
