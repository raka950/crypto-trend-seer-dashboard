
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, AlertTriangle, CircleAlert } from 'lucide-react';

interface Alert {
  id: string;
  type: 'positive' | 'warning' | 'negative';
  message: string;
}

interface TrendAlertsProps {
  alerts: Alert[];
  isLoading: boolean;
}

const TrendAlerts: React.FC<TrendAlertsProps> = ({ alerts, isLoading }) => {
  const renderIcon = (type: string) => {
    switch(type) {
      case 'positive':
        return <Check className="w-5 h-5 text-btc-positive" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'negative':
        return <CircleAlert className="w-5 h-5 text-btc-negative" />;
      default:
        return <Check className="w-5 h-5 text-btc-positive" />;
    }
  };

  const getAlertBackground = (type: string) => {
    switch(type) {
      case 'positive':
        return 'bg-btc-positive/10 border-btc-positive/20';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20';
      case 'negative':
        return 'bg-btc-negative/10 border-btc-negative/20';
      default:
        return 'bg-btc-positive/10 border-btc-positive/20';
    }
  };

  return (
    <Card className="glass-card h-full">
      <CardHeader>
        <CardTitle>Trend Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-[100px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-btc-gold"></div>
          </div>
        ) : alerts.length > 0 ? (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div 
                key={alert.id}
                className={`flex p-3 rounded-lg border ${getAlertBackground(alert.type)}`}
              >
                <div className="mr-3 mt-0.5">{renderIcon(alert.type)}</div>
                <p className="text-sm">{alert.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[100px] text-gray-400">
            <AlertTriangle className="h-10 w-10 mb-2 opacity-50" />
            <p>No active alerts</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrendAlerts;
