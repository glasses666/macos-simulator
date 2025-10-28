import React, { useState } from 'react';
import { Monitor, Wifi, Bell, Lock, Palette, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/contexts/ThemeContext';

interface SettingsSection {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const settingsSections: SettingsSection[] = [
  { id: 'display', name: 'Display', icon: <Monitor className="h-5 w-5" /> },
  { id: 'network', name: 'Network', icon: <Wifi className="h-5 w-5" /> },
  { id: 'notifications', name: 'Notifications', icon: <Bell className="h-5 w-5" /> },
  { id: 'privacy', name: 'Privacy & Security', icon: <Lock className="h-5 w-5" /> },
  { id: 'appearance', name: 'Appearance', icon: <Palette className="h-5 w-5" /> },
  { id: 'general', name: 'General', icon: <Globe className="h-5 w-5" /> },
];

export const Settings: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState('appearance');
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [autoUpdate, setAutoUpdate] = useState(true);

  const renderSectionContent = () => {
    switch (selectedSection) {
      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Appearance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Dark Mode</div>
                    <div className="text-sm text-muted-foreground">
                      Use dark color scheme
                    </div>
                  </div>
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={toggleTheme}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Allow Notifications</div>
                    <div className="text-sm text-muted-foreground">
                      Show alerts and banners
                    </div>
                  </div>
                  <Switch
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">General</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Automatic Updates</div>
                    <div className="text-sm text-muted-foreground">
                      Keep macOS up to date automatically
                    </div>
                  </div>
                  <Switch
                    checked={autoUpdate}
                    onCheckedChange={setAutoUpdate}
                  />
                </div>
                <div className="pt-4 border-t border-border/50">
                  <div className="font-medium mb-2">About This Mac</div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>macOS 26.0.0</div>
                    <div>Model: MacBook Pro (Simulator)</div>
                    <div>Processor: Virtual CPU</div>
                    <div>Memory: 16 GB</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Settings for {settingsSections.find(s => s.id === selectedSection)?.name}</p>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r border-border/50 bg-muted/30 p-3">
        <h2 className="text-xl font-semibold mb-4 px-2">System Settings</h2>
        <div className="space-y-1">
          {settingsSections.map((section) => (
            <Button
              key={section.id}
              variant={selectedSection === section.id ? 'secondary' : 'ghost'}
              className="w-full justify-start gap-3"
              onClick={() => setSelectedSection(section.id)}
            >
              {section.icon}
              {section.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        {renderSectionContent()}
      </div>
    </div>
  );
};
