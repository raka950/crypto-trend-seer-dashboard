
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Bell, BellOff, BellRing } from 'lucide-react';

const PriceAlert = () => {
  const { toast } = useToast();
  const [aboveThreshold, setAboveThreshold] = useState<string>('');
  const [belowThreshold, setBelowThreshold] = useState<string>('');
  const [alertsActive, setAlertsActive] = useState<boolean>(false);
  const [notificationsPermission, setNotificationsPermission] = useState<string>(
    Notification.permission
  );

  const handleRequestPermission = async () => {
    if (Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      setNotificationsPermission(permission);
      
      if (permission === 'granted') {
        toast({
          title: "Notifications enabled",
          description: "You will receive price alerts when thresholds are reached.",
        });
      } else {
        toast({
          title: "Notifications denied",
          description: "You will not receive price alerts. Please enable notifications in your browser settings.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSetAlerts = () => {
    if (!aboveThreshold && !belowThreshold) {
      toast({
        title: "Error",
        description: "Please set at least one price alert threshold",
        variant: "destructive",
      });
      return;
    }

    if (notificationsPermission !== 'granted') {
      handleRequestPermission();
      return;
    }

    setAlertsActive(!alertsActive);
    
    if (!alertsActive) {
      toast({
        title: "Alerts activated",
        description: `You will be notified when BTC price ${aboveThreshold ? `exceeds $${aboveThreshold}` : ''}${aboveThreshold && belowThreshold ? ' or ' : ''}${belowThreshold ? `falls below $${belowThreshold}` : ''}`,
      });
    } else {
      toast({
        title: "Alerts deactivated",
        description: "Price alerts have been turned off",
      });
    }
  };

  const sendTestNotification = () => {
    if (Notification.permission === 'granted') {
      const notification = new Notification('Bitcoin Price Alert Test', {
        body: 'This is a test notification. Real alerts will be sent when price thresholds are reached.',
        icon: '/favicon.ico'
      });
      
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } else {
      handleRequestPermission();
    }
  };

  return (
    <Card className="glass-card h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {alertsActive ? (
            <BellRing className="h-5 w-5 text-btc-gold" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          Price Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 block mb-1">Price Alert Above ($)</label>
            <Input
              type="number"
              placeholder="e.g. 85000"
              value={aboveThreshold}
              onChange={(e) => setAboveThreshold(e.target.value)}
              className="bg-btc-navy/50 border-gray-700"
              disabled={alertsActive}
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Price Alert Below ($)</label>
            <Input
              type="number"
              placeholder="e.g. 75000"
              value={belowThreshold}
              onChange={(e) => setBelowThreshold(e.target.value)}
              className="bg-btc-navy/50 border-gray-700"
              disabled={alertsActive}
            />
          </div>
          <div className="pt-2 flex gap-2">
            <Button 
              onClick={handleSetAlerts} 
              className={`flex-1 ${alertsActive ? 'bg-red-600 hover:bg-red-700' : 'bg-btc-gold hover:bg-btc-gold/80'}`}
            >
              {alertsActive ? (
                <>
                  <BellOff className="mr-2 h-4 w-4" />
                  Deactivate Alerts
                </>
              ) : (
                <>
                  <Bell className="mr-2 h-4 w-4" />
                  Activate Alerts
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={sendTestNotification}
              className="border-gray-700"
            >
              Test
            </Button>
          </div>
          
          {notificationsPermission !== 'granted' && (
            <div className="mt-2 p-2 bg-yellow-900/20 rounded-md text-yellow-200 text-sm">
              <p>Browser notifications are required for alerts</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceAlert;

