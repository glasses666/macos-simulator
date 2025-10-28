import React, { useState, useEffect } from 'react';
import { WindowProvider, useWindows } from '@/contexts/WindowContext';
import { Window } from '@/components/Window';
import { Dock } from '@/components/Dock';
import { MenuBar } from '@/components/MenuBar';
import { BootScreen } from '@/components/BootScreen';

const Desktop: React.FC = () => {
  const { windows } = useWindows();

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
      {/* Wallpaper */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-60" />
      
      {/* Menu Bar */}
      <MenuBar />

      {/* Desktop Area */}
      <div className="relative h-full pt-7 pb-20">
        {/* Windows */}
        {windows.map((window) => (
          <Window key={window.id} window={window} />
        ))}
      </div>

      {/* Dock */}
      <Dock />
    </div>
  );
};

export default function Home() {
  const [isBooting, setIsBooting] = useState(true);
  const [showDesktop, setShowDesktop] = useState(false);

  useEffect(() => {
    // Check if user has already booted (use sessionStorage for per-session boot)
    const hasBooted = sessionStorage.getItem('macos-booted');
    if (hasBooted) {
      setIsBooting(false);
      setShowDesktop(true);
    }
  }, []);

  const handleBootComplete = () => {
    sessionStorage.setItem('macos-booted', 'true');
    setIsBooting(false);
    setTimeout(() => {
      setShowDesktop(true);
    }, 300);
  };

  return (
    <>
      {isBooting && <BootScreen onBootComplete={handleBootComplete} />}
      {showDesktop && (
        <WindowProvider>
          <Desktop />
        </WindowProvider>
      )}
    </>
  );
}
