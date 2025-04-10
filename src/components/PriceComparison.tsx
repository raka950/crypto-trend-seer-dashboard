
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartLineUp } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface PriceComparisonProps {
  historicalData: Array<{ date: string; price: number }>;
  predictedData: Array<{ date: string; price: number }>;
  isLoading: boolean;
}

const PriceComparison: React.FC<PriceComparisonProps> = ({ 
  historicalData, 
  predictedData, 
  isLoading 
}) => {
  // Get only the last 5 days of data
  const getLastFiveDaysData = () => {
    if (historicalData.length === 0 || predictedData.length === 0) return [];
    
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    
    const last5DaysData = historicalData
      .filter(item => new Date(item.date) >= fiveDaysAgo)
      .slice(-5);
      
    // Find matching predicted data points
    return last5DaysData.map(actual => {
      const matchingPrediction = predictedData.find(
        pred => new Date(pred.date).toDateString() === new Date(actual.date).toDateString()
      );
      
      return {
        date: new Date(actual.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        actual: actual.price,
        predicted: matchingPrediction?.price || null,
        difference: matchingPrediction 
          ? ((actual.price - matchingPrediction.price) / matchingPrediction.price) * 100
          : 0
      };
    });
  };
  
  const comparisonData = getLastFiveDaysData();
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const actualPrice = payload[0].value;
      const predictedPrice = payload[1]?.value;
      const difference = actualPrice && predictedPrice 
        ? ((actualPrice - predictedPrice) / predictedPrice * 100).toFixed(2)
        : 'N/A';
      
      return (
        <div className="p-3 bg-btc-navy border border-gray-700 rounded shadow-lg">
          <p className="text-gray-300">{label}</p>
          <p className="text-white font-semibold">
            Actual: ${Number(actualPrice).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </p>
          {predictedPrice && (
            <p className="text-btc-gold">
              Predicted: ${Number(predictedPrice).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          )}
          {difference !== 'N/A' && (
            <p className={Number(difference) >= 0 ? "text-btc-positive" : "text-btc-negative"}>
              Difference: {difference}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="glass-card h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChartLineUp className="h-5 w-5 text-btc-gold" />
          Prediction Accuracy (Last 5 Days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-btc-gold"></div>
          </div>
        ) : comparisonData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={comparisonData}
              margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="chart-grid" />
              <XAxis dataKey="date" tick={{ fill: '#9CA3AF' }} />
              <YAxis 
                tick={{ fill: '#9CA3AF' }}
                tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ bottom: 0 }} />
              <ReferenceLine y={0} stroke="#666" />
              <Bar name="Actual Price" dataKey="actual" fill="#5469FF" radius={[4, 4, 0, 0]} />
              <Bar name="Predicted Price" dataKey="predicted" fill="#00D0B0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-[200px] text-gray-400">
            <p>No comparison data available</p>
            <p className="text-sm mt-2">Check back once we have 5 days of predictions</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PriceComparison;
