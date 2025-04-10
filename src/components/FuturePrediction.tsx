
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface FuturePredictionProps {
  predictedData: Array<{ date: string; price: number }>;
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

const getDateFormatted = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const FuturePrediction: React.FC<FuturePredictionProps> = ({ predictedData, isLoading }) => {
  // Get only future predictions (7 days)
  const futurePredictions = predictedData.filter((_, index) => index > 0).slice(0, 7);
  
  // Calculate potential gain/loss percentage from current price
  const calculateChange = (predictedPrice: number, currentPrice: number) => {
    if (!currentPrice) return 0;
    return ((predictedPrice - currentPrice) / currentPrice) * 100;
  };
  
  const currentPrice = predictedData[0]?.price || 0;

  return (
    <Card className="glass-card h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-btc-gold" />
          7-Day Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-btc-gold"></div>
          </div>
        ) : (
          <div className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Predicted Price</TableHead>
                  <TableHead>Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {futurePredictions.map((prediction, index) => {
                  const changePercent = calculateChange(prediction.price, currentPrice);
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{getDateFormatted(prediction.date)}</TableCell>
                      <TableCell>{formatCurrency(prediction.price)}</TableCell>
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
        )}
      </CardContent>
    </Card>
  );
};

export default FuturePrediction;
