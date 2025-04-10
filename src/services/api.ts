
interface BitcoinPrice {
  bitcoin: {
    usd: number;
  };
}

export interface HistoricalPriceData {
  prices: number[][];
}

// Fallback price for when the API is unavailable
const FALLBACK_BITCOIN_PRICE = 79800;

// Fallback historical data generator
const generateFallbackHistoricalData = (days: number = 30): Array<{ date: string; price: number }> => {
  const result = [];
  const basePrice = FALLBACK_BITCOIN_PRICE;
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const pastDate = new Date(now);
    pastDate.setDate(pastDate.getDate() - i);
    
    // Add some randomness to create realistic looking price data
    const randomFactor = 0.95 + (Math.random() * 0.1); // Between -5% and +5%
    const price = basePrice * randomFactor;
    
    result.push({
      date: pastDate.toISOString(),
      price,
    });
  }
  
  return result;
};

export const fetchBitcoinPrice = async (): Promise<number> => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const data: BitcoinPrice = await response.json();
    return data.bitcoin.usd;
  } catch (error) {
    console.error('Error fetching Bitcoin price:', error);
    // Return fallback price if API call fails
    return FALLBACK_BITCOIN_PRICE;
  }
};

export const fetchHistoricalPriceData = async (days: number = 7): Promise<Array<{ date: string; price: number }>> => {
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const data: HistoricalPriceData = await response.json();
    
    return data.prices.map(([timestamp, price]) => ({
      date: new Date(timestamp).toISOString(),
      price,
    }));
  } catch (error) {
    console.error('Error fetching historical price data:', error);
    // Return fallback data if API call fails
    return generateFallbackHistoricalData(days);
  }
};

// Mock data for news feed
export const fetchBitcoinNews = async (): Promise<any[]> => {
  // In a real scenario, this would fetch from a news API
  return [
    {
      id: '1',
      title: 'Bitcoin Hits New All-Time High as Institutional Interest Grows',
      source: 'CryptoNews',
      url: '#',
      date: new Date().toLocaleDateString(),
    },
    {
      id: '2',
      title: 'Major Bank Announces Bitcoin Custody Services for Clients',
      source: 'Financial Times',
      url: '#',
      date: new Date().toLocaleDateString(),
    },
    {
      id: '3',
      title: 'Bitcoin Mining Difficulty Reaches Record Levels',
      source: 'CoinDesk',
      url: '#',
      date: new Date().toLocaleDateString(),
    },
  ];
};

// Mock data for sentiment analysis
export const fetchSentimentData = async () => {
  // In a real scenario, this would fetch from a sentiment analysis API
  return {
    positive: 65,
    neutral: 20,
    negative: 15,
  };
};

// Mock data for prediction confidence
export const fetchPredictionConfidence = async () => {
  // In a real scenario, this would come from the ML model
  return 80;
};

// Mock data for trend alerts
export const fetchTrendAlerts = async () => {
  // In a real scenario, this would come from the ML model or analysis
  return [
    {
      id: '1',
      type: 'positive',
      message: 'Current trend resembles November 2020 surge pattern',
    },
    {
      id: '2',
      type: 'warning',
      message: 'Potential short-term volatility expected in next 24-48 hours',
    },
  ];
};

// Mock data for predicted prices
export const fetchPredictedPrices = async (days: number = 7): Promise<Array<{ date: string; price: number }>> => {
  try {
    // First try to get current price from API
    const currentPrice = await fetchBitcoinPrice();
    const result = [];
    
    // Generate some simulated prediction data starting from today
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const futureDate = new Date(now);
      futureDate.setDate(futureDate.getDate() + i);
      
      // Create a slight uptrend with some random variation
      const randomFactor = 1 + (Math.random() * 0.04 - 0.01); // -1% to +3%
      const predictedPrice = currentPrice * Math.pow(randomFactor, i);
      
      result.push({
        date: futureDate.toISOString(),
        price: predictedPrice,
      });
    }
    
    return result;
  } catch (error) {
    console.error('Error generating predicted prices:', error);
    // Return fallback prediction data if there's an error
    return generateFallbackHistoricalData(7).map(item => ({
      ...item,
      price: item.price * (1 + (Math.random() * 0.05)) // Add some variation to the price
    }));
  }
};
