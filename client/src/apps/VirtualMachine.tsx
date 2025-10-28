import React, { useState } from 'react';
import { Power, Play, Square, RotateCw, Monitor, HardDrive, Cpu, MemoryStick } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface VM {
  id: string;
  name: string;
  os: string;
  icon: string;
  status: 'stopped' | 'running' | 'paused';
  ram: string;
  disk: string;
  cpu: string;
}

const mockVMs: VM[] = [
  {
    id: 'vm1',
    name: 'Windows 11',
    os: 'Windows 11 Pro',
    icon: '🪟',
    status: 'stopped',
    ram: '8 GB',
    disk: '64 GB',
    cpu: '4 Cores',
  },
  {
    id: 'vm2',
    name: 'Ubuntu 22.04',
    os: 'Ubuntu 22.04 LTS',
    icon: '🐧',
    status: 'stopped',
    ram: '4 GB',
    disk: '32 GB',
    cpu: '2 Cores',
  },
  {
    id: 'vm3',
    name: 'macOS Ventura',
    os: 'macOS 13 Ventura',
    icon: '🍎',
    status: 'stopped',
    ram: '16 GB',
    disk: '128 GB',
    cpu: '8 Cores',
  },
];

export const VirtualMachine: React.FC = () => {
  const [vms, setVms] = useState<VM[]>(mockVMs);
  const [selectedVM, setSelectedVM] = useState<VM | null>(null);
  const [vmScreen, setVmScreen] = useState<string | null>(null);

  const startVM = (vmId: string) => {
    setVms(vms.map(vm => 
      vm.id === vmId ? { ...vm, status: 'running' as const } : vm
    ));
    const vm = vms.find(v => v.id === vmId);
    if (vm) {
      setVmScreen(vmId);
    }
  };

  const stopVM = (vmId: string) => {
    setVms(vms.map(vm => 
      vm.id === vmId ? { ...vm, status: 'stopped' as const } : vm
    ));
    if (vmScreen === vmId) {
      setVmScreen(null);
    }
  };

  const restartVM = (vmId: string) => {
    stopVM(vmId);
    setTimeout(() => startVM(vmId), 500);
  };

  const renderVMScreen = (vm: VM) => {
    if (vm.os.includes('Windows')) {
      return (
        <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 flex flex-col items-center justify-center text-white">
          <div className="text-8xl mb-8">🪟</div>
          <div className="text-4xl font-light mb-4">Windows 11</div>
          <div className="flex items-center gap-3 mt-8">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <div className="text-sm">Starting...</div>
          </div>
          <div className="mt-12 text-sm text-white/70">
            Press Ctrl+Alt to release mouse and keyboard
          </div>
        </div>
      );
    } else if (vm.os.includes('Ubuntu')) {
      return (
        <div className="w-full h-full bg-gradient-to-br from-orange-600 to-purple-900 flex flex-col items-center justify-center text-white">
          <div className="text-8xl mb-8">🐧</div>
          <div className="text-4xl font-light mb-4">Ubuntu 22.04 LTS</div>
          <div className="mt-8 font-mono text-sm bg-black/30 p-4 rounded">
            <div>Ubuntu 22.04.1 LTS tty1</div>
            <div className="mt-2">localhost login: <span className="animate-pulse">_</span></div>
          </div>
          <div className="mt-12 text-sm text-white/70">
            Press Ctrl+Alt to release mouse and keyboard
          </div>
        </div>
      );
    } else if (vm.os.includes('macOS')) {
      return (
        <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-700 flex flex-col items-center justify-center text-white">
          <div className="text-8xl mb-8">🍎</div>
          <div className="text-4xl font-light mb-4">macOS Ventura</div>
          <div className="flex items-center gap-3 mt-8">
            <div className="w-24 h-1 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
          </div>
          <div className="mt-4 text-sm">Loading system...</div>
          <div className="mt-12 text-sm text-white/70">
            Press Ctrl+Alt to release mouse and keyboard
          </div>
        </div>
      );
    }
    return null;
  };

  if (vmScreen) {
    const vm = vms.find(v => v.id === vmScreen);
    if (!vm) return null;

    return (
      <div className="h-full flex flex-col bg-background">
        {/* VM Control Bar */}
        <div className="flex items-center justify-between p-3 border-b border-border/50 bg-muted/30">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{vm.icon}</span>
            <div>
              <div className="font-semibold">{vm.name}</div>
              <div className="text-xs text-muted-foreground">
                {vm.cpu} • {vm.ram} • {vm.disk}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-xs">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Running
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => restartVM(vm.id)}
              className="gap-2"
            >
              <RotateCw className="h-4 w-4" />
              Restart
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => stopVM(vm.id)}
              className="gap-2"
            >
              <Square className="h-4 w-4" />
              Stop
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setVmScreen(null)}
            >
              Exit Fullscreen
            </Button>
          </div>
        </div>

        {/* VM Screen */}
        <div className="flex-1 bg-black">
          {renderVMScreen(vm)}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border/50 bg-muted/30">
        <h2 className="text-xl font-semibold">Virtual Machines</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage and run virtual operating systems
        </p>
      </div>

      {/* VM List */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vms.map((vm) => (
            <Card
              key={vm.id}
              className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => setSelectedVM(vm)}
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl">{vm.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{vm.name}</h3>
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      vm.status === 'running' 
                        ? 'bg-green-500/20 text-green-500' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {vm.status === 'running' ? '● Running' : '○ Stopped'}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-3">{vm.os}</div>
                  
                  <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                    <div className="flex items-center gap-1">
                      <Cpu className="h-3 w-3 text-muted-foreground" />
                      <span>{vm.cpu}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MemoryStick className="h-3 w-3 text-muted-foreground" />
                      <span>{vm.ram}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <HardDrive className="h-3 w-3 text-muted-foreground" />
                      <span>{vm.disk}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {vm.status === 'stopped' ? (
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          startVM(vm.id);
                        }}
                        className="gap-2"
                      >
                        <Play className="h-3 w-3" />
                        Start
                      </Button>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setVmScreen(vm.id);
                          }}
                          className="gap-2"
                        >
                          <Monitor className="h-3 w-3" />
                          Open
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            stopVM(vm.id);
                          }}
                          className="gap-2"
                        >
                          <Square className="h-3 w-3" />
                          Stop
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
