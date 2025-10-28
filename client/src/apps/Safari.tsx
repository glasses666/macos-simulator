import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Home, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const Safari: React.FC = () => {
  const [url, setUrl] = useState('https://www.google.com');
  const [inputUrl, setInputUrl] = useState('https://www.google.com');
  const [history, setHistory] = useState<string[]>(['https://www.google.com']);
  const [historyIndex, setHistoryIndex] = useState(0);

  const handleNavigate = (newUrl: string) => {
    let formattedUrl = newUrl;
    if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
      if (newUrl.includes('.')) {
        formattedUrl = 'https://' + newUrl;
      } else {
        formattedUrl = 'https://www.google.com/search?q=' + encodeURIComponent(newUrl);
      }
    }
    setUrl(formattedUrl);
    setInputUrl(formattedUrl);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(formattedUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setUrl(history[newIndex]);
      setInputUrl(history[newIndex]);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setUrl(history[newIndex]);
      setInputUrl(history[newIndex]);
    }
  };

  const handleRefresh = () => {
    setUrl(url + '?refresh=' + Date.now());
  };

  const handleHome = () => {
    handleNavigate('https://www.google.com');
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Navigation Bar */}
      <div className="flex items-center gap-2 p-3 border-b border-border/50 bg-muted/30">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          disabled={historyIndex === 0}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleForward}
          disabled={historyIndex === history.length - 1}
          className="h-8 w-8"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRefresh}
          className="h-8 w-8"
        >
          <RotateCw className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleHome}
          className="h-8 w-8"
        >
          <Home className="h-4 w-4" />
        </Button>
        <div className="flex-1 flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleNavigate(inputUrl);
                }
              }}
              className="pl-10 bg-muted/50"
              placeholder="Search or enter website name"
            />
          </div>
        </div>
      </div>

      {/* Browser Content */}
      <div className="flex-1 relative bg-white">
        <iframe
          src={url}
          className="w-full h-full border-0"
          title="Safari Browser"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </div>
  );
};
