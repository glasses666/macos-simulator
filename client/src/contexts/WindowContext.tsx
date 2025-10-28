import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface WindowState {
  id: string;
  title: string;
  appId: string;
  icon: string;
  component: ReactNode;
  isMinimized: boolean;
  isMaximized: boolean;
  isFocused: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}

interface WindowContextType {
  windows: WindowState[];
  openWindow: (appId: string, title: string, icon: string, component: ReactNode) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, width: number, height: number) => void;
}

const WindowContext = createContext<WindowContextType | undefined>(undefined);

export const useWindows = () => {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error('useWindows must be used within WindowProvider');
  }
  return context;
};

export const WindowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [nextZIndex, setNextZIndex] = useState(100);

  const openWindow = useCallback((appId: string, title: string, icon: string, component: ReactNode) => {
    const id = `${appId}-${Date.now()}`;
    const newWindow: WindowState = {
      id,
      title,
      appId,
      icon,
      component,
      isMinimized: false,
      isMaximized: false,
      isFocused: true,
      position: { x: 100 + windows.length * 30, y: 80 + windows.length * 30 },
      size: { width: 800, height: 600 },
      zIndex: nextZIndex,
    };

    setWindows((prev) => prev.map(w => ({ ...w, isFocused: false })).concat(newWindow));
    setNextZIndex((prev) => prev + 1);
  }, [windows.length, nextZIndex]);

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter(w => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map(w => w.id === id ? { ...w, isMinimized: !w.isMinimized } : w)
    );
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)
    );
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows((prev) => {
      const window = prev.find(w => w.id === id);
      if (!window) return prev;

      return prev.map(w => ({
        ...w,
        isFocused: w.id === id,
        zIndex: w.id === id ? nextZIndex : w.zIndex,
      }));
    });
    setNextZIndex((prev) => prev + 1);
  }, [nextZIndex]);

  const updateWindowPosition = useCallback((id: string, x: number, y: number) => {
    setWindows((prev) =>
      prev.map(w => w.id === id ? { ...w, position: { x, y } } : w)
    );
  }, []);

  const updateWindowSize = useCallback((id: string, width: number, height: number) => {
    setWindows((prev) =>
      prev.map(w => w.id === id ? { ...w, size: { width, height } } : w)
    );
  }, []);

  return (
    <WindowContext.Provider
      value={{
        windows,
        openWindow,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        focusWindow,
        updateWindowPosition,
        updateWindowSize,
      }}
    >
      {children}
    </WindowContext.Provider>
  );
};
