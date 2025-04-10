
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  date: string;
}

interface NewsFeedProps {
  news: NewsItem[];
  isLoading: boolean;
}

const NewsFeed: React.FC<NewsFeedProps> = ({ news, isLoading }) => {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>BTC News Feed</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse p-3 border border-gray-700 rounded-lg">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : news.length > 0 ? (
          <div className="space-y-2">
            {news.map((item) => (
              <a 
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 border border-gray-700 rounded-lg hover:bg-btc-navy/50 transition-colors"
              >
                <div className="flex justify-between">
                  <h3 className="font-medium text-sm md:text-base line-clamp-1">{item.title}</h3>
                  <ExternalLink className="h-4 w-4 flex-shrink-0 ml-2 text-gray-400" />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-400">{item.source}</span>
                  <span className="text-xs text-gray-400">{item.date}</span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[100px] text-gray-400">
            <p>No news available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NewsFeed;
