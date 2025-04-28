
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CalendarDays } from 'lucide-react';

interface TimeframePredictionProps {
  predictedData: Array<{ date: string; price: number }>;
  currentPrice: number;
  timeframe: '24h' | '7d' | '30d' | '1y';
  isLoading: boolean;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const getTimeframeTitle = (timeframe: string) => {
  switch(timeframe) {
    case '24h': return 'Next 24 Hours';
    case '7d': return 'Next 7 Days';
    case '30d': return 'Next 30 Days';
    case '1y': return 'Next 12 Months';
    default: return 'Predictions';
  }
};

const TimeframePrediction: React.FC<TimeframePredictionProps> = ({
  predictedData,
  currentPrice,
  timeframe,
  isLoading
}) => {
  const getFormattedDate = (dateString: string, timeframe: string) => {
    const date = new Date(dateString);
    if (timeframe === '24h') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
      year: timeframe === '1y' ? 'numeric' : undefined 
    });
  };

  const calculateChange = (predictedPrice: number) => {
    if (!currentPrice) return 0;
    return ((predictedPrice - currentPrice) / currentPrice) * 100;
  };

  const getPredictionPoints = () => {
    let points = [];
    const now = new Date();
    
    switch(timeframe) {
      case '24h':
        // Show predictions every 4 hours
        for(let i = 1; i <= 6; i++) {
          const futureDate = new Date(now);
          futureDate.setHours(futureDate.getHours() + (i * 4));
          points.push({
            date: futureDate.toISOString(),
            interval: `+${i * 4}h`
          });
        }
        break;
      case '7d':
        // Show daily predictions
        for(let i = 1; i <= 7; i++) {
          const futureDate = new Date(now);
          futureDate.setDate(futureDate.getDate() + i);
          points.push({
            date: futureDate.toISOString(),
            interval: `Day ${i}`
          });
        }
        break;
      case '30d':
        // Show weekly predictions
        for(let i = 1; i <= 4; i++) {
          const futureDate = new Date(now);
          futureDate.setDate(futureDate.getDate() + (i * 7));
          points.push({
            date: futureDate.toISOString(),
            interval: `Week ${i}`
          });
        }
        break;
      case '1y':
        // Show monthly predictions
        for(let i = 1; i <= 12; i++) {
          const futureDate = new Date(now);
          futureDate.setMonth(futureDate.getMonth() + i);
          points.push({
            date: futureDate.toISOString(),
            interval: `Month ${i}`
          });
        }
        break;
    }
    return points;
  };

  const predictionPoints = getPredictionPoints();

  return (
    <Card className="glass-card h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-btc-gold" />
          {getTimeframeTitle(timeframe)} Prediction
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-btc-gold"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-btc-navy/30 border border-btc-navy">
              <p className="text-sm text-gray-400">Current Price: {formatCurrency(currentPrice)}</p>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Predicted Price</TableHead>
                    <TableHead>Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {predictionPoints.map((point, index) => {
                    const predictedPrice = currentPrice * (1 + (Math.random() * 0.02 - 0.01) * (index + 1));
                    const changePercent = calculateChange(predictedPrice);
                    
                    return (
                      <TableRow key={point.date}>
                        <TableCell className="font-medium">
                          {point.interval}
                          <br />
                          <span className="text-xs text-gray-400">
                            {getFormattedDate(point.date, timeframe)}
                          </span>
                        </TableCell>
                        <TableCell>{formatCurrency(predictedPrice)}</TableCell>
                        <TableCell className={changePercent >= 0 ? 'text-btc-positive' : 'text-btc-negative'}>
                          <div className="flex items-center gap-1">
                            {changePercent >= 0 ? '↑' : '↓'} 
                            {Math.abs(changePercent).toFixed(2)}%
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TimeframePrediction;
