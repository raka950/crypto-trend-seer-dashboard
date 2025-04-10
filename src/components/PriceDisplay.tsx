
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PriceDisplayProps {
  price: number;
  previousPrice: number;
  isLoading: boolean;
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

const PriceDisplay: React.FC<PriceDisplayProps> = ({ price, previousPrice, isLoading }) => {
  const priceChange = price - previousPrice;
  const percentChange = previousPrice !== 0 
    ? (priceChange / previousPrice) * 100 
    : 0;
  
  const isPositive = priceChange >= 0;

  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-semibold mb-1">Bitcoin</h2>
      <div className="flex items-end">
        <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold ${isLoading ? 'animate-pulse' : ''}`}>
          {formatPrice(price)}
        </h1>
        
        {!isLoading && Math.abs(previousPrice) > 0 && (
          <div className={`flex items-center ml-4 mb-1 ${isPositive ? 'text-btc-positive' : 'text-btc-negative'}`}>
            {isPositive ? <TrendingUp className="w-5 h-5 mr-1" /> : <TrendingDown className="w-5 h-5 mr-1" />}
            <span className="font-medium">
              {percentChange.toFixed(2)}%
            </span>
          </div>
        )}
      </div>
      <p className="text-gray-400 text-sm mt-1">
        Last updated: {new Date().toLocaleTimeString()}
      </p>
    </div>
  );
};

export default PriceDisplay;
