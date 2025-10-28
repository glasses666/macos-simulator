import React, { useState, useEffect } from 'react';

interface BootScreenProps {
  onBootComplete: () => void;
}

export const BootScreen: React.FC<BootScreenProps> = ({ onBootComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<'logo' | 'loading' | 'complete'>('logo');

  useEffect(() => {
    // Logo stage - show Apple logo for 2 seconds
    const logoTimer = setTimeout(() => {
      setStage('loading');
    }, 2000);

    return () => clearTimeout(logoTimer);
  }, []);

  useEffect(() => {
    if (stage !== 'loading') return;

    // Loading stage - progress bar animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStage('complete');
          setTimeout(() => {
            onBootComplete();
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [stage, onBootComplete]);

  return (
    <div className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center">
      {/* Apple Logo */}
      <div
        className={`transition-all duration-1000 ${
          stage === 'logo' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <div className="text-9xl mb-8 filter drop-shadow-2xl">
          
        </div>
      </div>

      {/* Loading Progress Bar */}
      {stage === 'loading' && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 w-64 animate-in fade-in duration-500">
          <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* macOS Version Text */}
      {stage === 'loading' && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-white/60 text-sm animate-in fade-in duration-500">
          macOS 26
        </div>
      )}
    </div>
  );
};
