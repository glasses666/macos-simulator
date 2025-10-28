import React from 'react';
import { useWindows } from '@/contexts/WindowContext';
import { Safari } from '@/apps/Safari';
import { Photos } from '@/apps/Photos';
import { Finder } from '@/apps/Finder';
import { Terminal } from '@/apps/Terminal';
import { Calculator } from '@/apps/Calculator';
import { Calendar } from '@/apps/Calendar';
import { Notes } from '@/apps/Notes';
import { Settings } from '@/apps/Settings';

interface DockApp {
  id: string;
  name: string;
  icon: string;
  component: React.ReactNode;
}

const dockApps: DockApp[] = [
  { id: 'finder', name: 'Finder', icon: '📁', component: <Finder /> },
  { id: 'safari', name: 'Safari', icon: '🧭', component: <Safari /> },
  { id: 'photos', name: 'Photos', icon: '🖼️', component: <Photos /> },
  { id: 'terminal', name: 'Terminal', icon: '⌨️', component: <Terminal /> },
  { id: 'calculator', name: 'Calculator', icon: '🔢', component: <Calculator /> },
  { id: 'calendar', name: 'Calendar', icon: '📅', component: <Calendar /> },
  { id: 'notes', name: 'Notes', icon: '📝', component: <Notes /> },
  { id: 'settings', name: 'Settings', icon: '⚙️', component: <Settings /> },
];

export const Dock: React.FC = () => {
  const { openWindow, windows, focusWindow, minimizeWindow } = useWindows();

  const handleAppClick = (app: DockApp) => {
    const existingWindow = windows.find(w => w.appId === app.id && !w.isMinimized);
    if (existingWindow) {
      focusWindow(existingWindow.id);
    } else {
      const minimizedWindow = windows.find(w => w.appId === app.id && w.isMinimized);
      if (minimizedWindow) {
        minimizeWindow(minimizedWindow.id);
        focusWindow(minimizedWindow.id);
      } else {
        openWindow(app.id, app.name, app.icon, app.component);
      }
    }
  };

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-50">
      <div className="backdrop-blur-2xl bg-card/40 border border-border/30 rounded-2xl px-3 py-2 shadow-2xl">
        <div className="flex items-end gap-2">
          {dockApps.map((app) => {
            const isActive = windows.some(w => w.appId === app.id);
            return (
              <div key={app.id} className="relative group">
                <button
                  onClick={() => handleAppClick(app)}
                  className="w-14 h-14 rounded-xl bg-muted/50 hover:bg-muted transition-all duration-200 flex items-center justify-center text-3xl hover:scale-110 active:scale-95 relative"
                  title={app.name}
                >
                  {app.icon}
                </button>
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover/95 backdrop-blur-sm text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {app.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
