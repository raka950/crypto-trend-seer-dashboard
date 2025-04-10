
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smile, Frown, Meh } from 'lucide-react';

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
  const renderSentimentEmoji = () => {
    // Determine overall sentiment
    const total = sentiment.positive + sentiment.neutral + sentiment.negative;
    const positivePercentage = (sentiment.positive / total) * 100;
    const negativePercentage = (sentiment.negative / total) * 100;
    
    let overall: string;
    let color: string;
    let EmojiIcon;
    let animationClass: string;
    
    if (positivePercentage > 60) {
      overall = 'Bullish';
      color = 'text-btc-positive';
      EmojiIcon = Smile;
      animationClass = 'animate-bounce';
    } else if (negativePercentage > 60) {
      overall = 'Bearish';
      color = 'text-btc-negative';
      EmojiIcon = Frown;
      animationClass = 'animate-pulse';
    } else {
      overall = 'Neutral';
      color = 'text-btc-neutral';
      EmojiIcon = Meh;
      animationClass = 'animate-pulse-subtle';
    }
    
    return (
      <div className="flex flex-col items-center justify-center text-center">
        <div className={`${animationClass} p-6`}>
          <EmojiIcon size={120} className={color} strokeWidth={1.5} />
        </div>
        <div className="mt-6">
          <p className="text-gray-400 text-sm">Overall Market Sentiment</p>
          <p className={`text-2xl font-bold ${color}`}>{overall}</p>
        </div>
      </div>
    );
  };

  return (
    <Card className="glass-card h-full">
      <CardHeader>
        <CardTitle>Sentiment Analysis</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        {isLoading ? (
          <div className="flex justify-center items-center h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-btc-gold"></div>
          </div>
        ) : (
          renderSentimentEmoji()
        )}
      </CardContent>
    </Card>
  );
};

export default SentimentAnalysis;
