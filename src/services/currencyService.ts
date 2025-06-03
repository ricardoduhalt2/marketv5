export interface CurrencyRates {
  usd: number;
  mxn: number;
}

export const fetchCurrencyRates = async (): Promise<CurrencyRates> => {
  try {
    // In a real app, you would fetch this from a currency API
    // For now, we'll return some default values
    return {
      usd: 0.7,    // 1 MATIC = 0.7 USD
      mxn: 17.5    // 1 MATIC = 17.5 MXN
    };
  } catch (error) {
    console.error('Error fetching currency rates:', error);
    // Return default values in case of error
    return {
      usd: 0.7,
      mxn: 17.5
    };
  }
};
