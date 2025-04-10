import React, { useEffect, useState } from 'react';
import BitcoinLogo from '@/components/BitcoinLogo';
import PriceDisplay from '@/components/PriceDisplay';
import PriceChart from '@/components/PriceChart';
import SentimentAnalysis from '@/components/SentimentAnalysis';
import PredictionConfidence from '@/components/PredictionConfidence';
import TrendAlerts from '@/components/TrendAlerts';
import NewsFeed from '@/components/NewsFeed';
import { 
  fetchBitcoinPrice, 
  fetchHistoricalPriceData,
  fetchBitcoinNews,
  fetchSentimentData,
  fetchPredictionConfidence,
  fetchTrendAlerts,
  fetchPredictedPrices
} from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Bitcoin } from 'lucide-react';

const Index = () => {
  const { toast } = useToast();
  const [bitcoinPrice, setBitcoinPrice] = useState(0);
  const [previousPrice, setPreviousPrice] = useState(0);
  const [isLoadingPrice, setIsLoadingPrice] = useState(true);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [predictedData, setPredictedData] = useState<any[]>([]);
  const [isLoadingChart, setIsLoadingChart] = useState(true);
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const [sentimentData, setSentimentData] = useState({ positive: 0, neutral: 0, negative: 0 });
  const [isLoadingSentiment, setIsLoadingSentiment] = useState(true);
  const [predictionConfidence, setPredictionConfidence] = useState(0);
  const [isLoadingConfidence, setIsLoadingConfidence] = useState(true);
  const [trendAlerts, setTrendAlerts] = useState<any[]>([]);
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const price = await fetchBitcoinPrice();
        setBitcoinPrice(price);
        setPreviousPrice(0);
        setIsLoadingPrice(false);
        
        const historical = await fetchHistoricalPriceData(30);
        setHistoricalData(historical);
        
        const predicted = await fetchPredictedPrices();
        setPredictedData(predicted);
        setIsLoadingChart(false);
        
        const news = await fetchBitcoinNews();
        setNewsItems(news);
        setIsLoadingNews(false);
        
        const sentiment = await fetchSentimentData();
        setSentimentData(sentiment);
        setIsLoadingSentiment(false);
        
        const confidence = await fetchPredictionConfidence();
        setPredictionConfidence(confidence);
        setIsLoadingConfidence(false);
        
        const alerts = await fetchTrendAlerts();
        setTrendAlerts(alerts);
        setIsLoadingAlerts(false);
        
      } catch (error) {
        console.error('Error fetching initial data:', error);
        toast({
          title: "Error",
          description: "Failed to load data. Please refresh the page.",
          variant: "destructive"
        });
      }
    };
    
    fetchInitialData();
    
    const priceInterval = setInterval(async () => {
      try {
        const newPrice = await fetchBitcoinPrice();
        setPreviousPrice(bitcoinPrice);
        setBitcoinPrice(newPrice);
      } catch (error) {
        console.error('Error updating price:', error);
      }
    }, 30000);
    
    return () => {
      clearInterval(priceInterval);
    };
  }, [toast]);

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="glass-card p-6 flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="hidden sm:block">
                <BitcoinLogo />
              </div>
              <div className="sm:ml-8">
                <PriceDisplay 
                  price={bitcoinPrice} 
                  previousPrice={previousPrice}
                  isLoading={isLoadingPrice}
                />
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-400 mb-1">Powered by</p>
              <h3 className="font-bold text-xl bg-gradient-to-r from-btc-gold to-btc-lightGold text-transparent bg-clip-text">
                CryptoTrendSeer
              </h3>
            </div>
          </div>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <PriceChart 
              data={historicalData}
              predictedData={predictedData}
              isLoading={isLoadingChart}
            />
          </div>
          
          <div>
            <SentimentAnalysis 
              sentiment={sentimentData}
              isLoading={isLoadingSentiment}
            />
          </div>
          
          <div>
            <PredictionConfidence 
              confidence={predictionConfidence}
              isLoading={isLoadingConfidence}
            />
          </div>
          
          <div>
            <TrendAlerts 
              alerts={trendAlerts}
              isLoading={isLoadingAlerts}
            />
          </div>
        </div>
        
        <div className="mt-6">
          <NewsFeed 
            news={newsItems}
            isLoading={isLoadingNews}
          />
        </div>
        
        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>Data provided by CoinGecko API. Predictions are for demonstration purposes only.</p>
          <p className="mt-1">© 2025 CryptoTrendSeer. Not financial advice.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
