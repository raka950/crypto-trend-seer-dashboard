
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PriceChartProps {
  data: Array<{ date: string; price: number }>;
  predictedData?: Array<{ date: string; price: number }>;
  isLoading: boolean;
}

interface ChartDataPoint {
  date: string;
  price?: number;
  predictedPrice?: number;
}

const PriceChart: React.FC<PriceChartProps> = ({ data, predictedData = [], isLoading }) => {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | '1y'>('7d');
  
  // Custom tooltip content
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-btc-navy border border-gray-700 rounded shadow-lg">
          <p className="text-gray-300">{label}</p>
          <p className="text-white font-semibold">
            ${Number(payload[0].value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          {payload[1] && (
            <p className="text-btc-positive font-medium">
              Prediction: ${Number(payload[1].value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Filter data based on selected timeframe
  const getTimeframeData = () => {
    if (data.length === 0) return [];
    const now = new Date();
    let cutoffDate;

    switch(timeframe) {
      case '24h':
        cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    return data.filter(item => new Date(item.date) >= cutoffDate);
  };

  const filteredData = getTimeframeData();
  
  // Combine historical and prediction data
  const combinedData: ChartDataPoint[] = [...filteredData.map(item => ({
    date: item.date,
    price: item.price
  }))];
  
  if (predictedData && predictedData.length > 0) {
    predictedData.forEach(item => {
      const existingIndex = combinedData.findIndex(d => d.date === item.date);
      if (existingIndex >= 0) {
        combinedData[existingIndex] = { 
          ...combinedData[existingIndex], 
          predictedPrice: item.price 
        };
      } else {
        combinedData.push({ 
          date: item.date, 
          predictedPrice: item.price 
        });
      }
    });
  }

  return (
    <Card className="glass-card h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Historical Price</CardTitle>
          <div className="flex space-x-1 text-sm">
            {(['24h', '7d', '30d', '1y'] as const).map(tf => (
              <button 
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-md ${
                  timeframe === tf 
                    ? 'bg-btc-navy text-white' 
                    : 'text-gray-400 hover:bg-btc-navy/50'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-btc-gold"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={combinedData}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5469FF" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#5469FF" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D0B0" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#00D0B0" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="chart-grid" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#9CA3AF' }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return timeframe === '24h' 
                    ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                    : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                }}
              />
              <YAxis 
                domain={['dataMin - 1000', 'dataMax + 1000']}
                tick={{ fill: '#9CA3AF' }}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#5469FF" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
                fillOpacity={0.2}
                fill="url(#colorPrice)"
                isAnimationActive={true}
              />
              {predictedData && predictedData.length > 0 && (
                <Line 
                  type="monotone" 
                  dataKey="predictedPrice" 
                  stroke="#00D0B0" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  activeDot={{ r: 6 }}
                  fillOpacity={0.1}
                  fill="url(#colorPrediction)"
                  isAnimationActive={true}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default PriceChart;
