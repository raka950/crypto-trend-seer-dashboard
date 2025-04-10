
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface PredictionConfidenceProps {
  confidence: number;
  isLoading: boolean;
}

const PredictionConfidence: React.FC<PredictionConfidenceProps> = ({ confidence, isLoading }) => {
  const getConfidenceColor = () => {
    if (confidence >= 80) return 'bg-btc-positive';
    if (confidence >= 60) return 'bg-green-600';
    if (confidence >= 40) return 'bg-yellow-500';
    if (confidence >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getConfidenceText = () => {
    if (confidence >= 80) return 'Very High';
    if (confidence >= 60) return 'High';
    if (confidence >= 40) return 'Moderate';
    if (confidence >= 20) return 'Low';
    return 'Very Low';
  };

  return (
    <Card className="glass-card h-full">
      <CardHeader>
        <CardTitle>Prediction Confidence</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-[40px]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-btc-gold"></div>
          </div>
        ) : (
          <>
            <div className="mb-2 flex justify-between items-center">
              <span className="text-sm text-gray-400">Confidence Level</span>
              <span className={`text-lg font-bold`}>{confidence}%</span>
            </div>
            <Progress value={confidence} className="h-2 bg-muted" indicatorClassName={getConfidenceColor()} />
            <div className="mt-4 text-center">
              <span className="text-sm text-gray-400">Model Accuracy:</span>
              <p className="text-lg font-bold">{getConfidenceText()}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PredictionConfidence;
