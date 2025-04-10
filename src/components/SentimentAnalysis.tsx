
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface SentimentData {
  positive: number;
  neutral: number;
  negative: number;
}

interface SentimentAnalysisProps {
  sentiment: SentimentData;
  isLoading: boolean;
}

const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({ sentiment, isLoading }) => {
  const data = [
    { name: 'Positive', value: sentiment.positive, color: '#00D0B0' },
    { name: 'Neutral', value: sentiment.neutral, color: '#5469FF' },
    { name: 'Negative', value: sentiment.negative, color: '#FF5E69' },
  ];

  const renderSentimentIndicator = () => {
    // Determine overall sentiment
    const total = sentiment.positive + sentiment.neutral + sentiment.negative;
    const positivePercentage = (sentiment.positive / total) * 100;
    const negativePercentage = (sentiment.negative / total) * 100;
    
    let overall: string;
    let color: string;
    
    if (positivePercentage > 60) {
      overall = 'Bullish';
      color = 'text-btc-positive';
    } else if (negativePercentage > 60) {
      overall = 'Bearish';
      color = 'text-btc-negative';
    } else {
      overall = 'Neutral';
      color = 'text-btc-neutral';
    }
    
    return (
      <div className="mt-3 text-center">
        <p className="text-gray-400 text-sm">Overall Market Sentiment</p>
        <p className={`text-xl font-bold ${color}`}>{overall}</p>
      </div>
    );
  };

  return (
    <Card className="glass-card h-full">
      <CardHeader>
        <CardTitle>Sentiment Analysis</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {isLoading ? (
          <div className="flex justify-center items-center h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-btc-gold"></div>
          </div>
        ) : (
          <>
            <div className="w-full h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between w-full mt-4">
              {data.map((entry) => (
                <div key={entry.name} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-sm text-gray-300">{entry.name}</span>
                </div>
              ))}
            </div>
            {renderSentimentIndicator()}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SentimentAnalysis;
