import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Volume2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export const MenuBar: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-7 backdrop-blur-2xl bg-card/40 border-b border-border/30 z-50 flex items-center justify-between px-4 text-sm">
      <div className="flex items-center gap-4">
        <button className="font-bold hover:bg-muted/50 px-2 py-0.5 rounded transition-colors">
          
        </button>
        <button className="hover:bg-muted/50 px-2 py-0.5 rounded transition-colors">
          Finder
        </button>
        <button className="hover:bg-muted/50 px-2 py-0.5 rounded transition-colors">
          File
        </button>
        <button className="hover:bg-muted/50 px-2 py-0.5 rounded transition-colors">
          Edit
        </button>
        <button className="hover:bg-muted/50 px-2 py-0.5 rounded transition-colors">
          View
        </button>
        <button className="hover:bg-muted/50 px-2 py-0.5 rounded transition-colors">
          Go
        </button>
        <button className="hover:bg-muted/50 px-2 py-0.5 rounded transition-colors">
          Window
        </button>
        <button className="hover:bg-muted/50 px-2 py-0.5 rounded transition-colors">
          Help
        </button>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="hover:bg-muted/50 px-2 py-0.5 rounded transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <Wifi className="w-4 h-4" />
        <Battery className="w-4 h-4" />
        <Volume2 className="w-4 h-4" />
        <div className="flex items-center gap-2">
          <span>{formatDate(currentTime)}</span>
          <span>{formatTime(currentTime)}</span>
        </div>
      </div>
    </div>
  );
};
