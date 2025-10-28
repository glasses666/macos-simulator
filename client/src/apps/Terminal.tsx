import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';

interface TerminalLine {
  type: 'command' | 'output' | 'error';
  text: string;
}

export const Terminal: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [mode, setMode] = useState<'local' | 'ssh'>('local');
  const [sshConnected, setSshConnected] = useState(false);
  const [sessionId] = useState(() => `ssh-${Date.now()}-${Math.random()}`);
  
  // SSH connection form
  const [sshHost, setSshHost] = useState('');
  const [sshPort, setSshPort] = useState('22');
  const [sshUsername, setSshUsername] = useState('');
  const [sshPassword, setSshPassword] = useState('');
  const [showSSHForm, setShowSSHForm] = useState(false);
  
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'output', text: 'macOS 26 Terminal - Type "help" for available commands' },
    { type: 'output', text: 'Type "ssh" to connect to a remote server' },
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const connectMutation = trpc.ssh.connect.useMutation({
    onSuccess: (result) => {
      if (result.success) {
        setSshConnected(true);
        setMode('ssh');
        setShowSSHForm(false);
        addLine('output', `Connected to ${sshHost}`);
        toast.success('SSH connection established');
      } else {
        addLine('error', `Connection failed: ${result.error}`);
        toast.error('SSH connection failed');
      }
    },
    onError: (error) => {
      addLine('error', `Connection error: ${error.message}`);
      toast.error('SSH connection error');
    },
  });

  const sendCommandMutation = trpc.ssh.sendCommand.useMutation();
  const disconnectMutation = trpc.ssh.disconnect.useMutation({
    onSuccess: () => {
      setSshConnected(false);
      setMode('local');
      addLine('output', 'SSH connection closed');
      toast.success('Disconnected from SSH');
    },
  });

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    return () => {
      if (sshConnected) {
        disconnectMutation.mutate({ sessionId });
      }
    };
  }, [sshConnected]);

  const addLine = (type: 'command' | 'output' | 'error', text: string) => {
    setLines((prev) => [...prev, { type, text }]);
  };

  const executeLocalCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    let output = '';

    if (trimmedCmd === 'ssh') {
      setShowSSHForm(true);
      return;
    }

    switch (trimmedCmd) {
      case 'help':
        output = 'Available commands:\n  help - Show this help message\n  clear - Clear the terminal\n  date - Show current date and time\n  echo <text> - Print text\n  whoami - Display current user\n  uname - Show system information\n  ssh - Connect to remote server';
        break;
      case 'clear':
        setLines([]);
        return;
      case 'date':
        output = new Date().toString();
        break;
      case 'whoami':
        output = 'user@macos26';
        break;
      case 'uname':
        output = 'macOS 26.0.0 Darwin Kernel';
        break;
      case 'exit':
        if (sshConnected) {
          disconnectMutation.mutate({ sessionId });
          return;
        }
        output = 'Use window controls to close terminal';
        break;
      default:
        if (trimmedCmd.startsWith('echo ')) {
          output = cmd.substring(5);
        } else if (trimmedCmd === '') {
          return;
        } else {
          output = `Command not found: ${cmd}. Type "help" for available commands.`;
        }
    }

    addLine('output', output);
  };

  const executeSSHCommand = (cmd: string) => {
    if (cmd.trim().toLowerCase() === 'exit') {
      disconnectMutation.mutate({ sessionId });
      return;
    }

    sendCommandMutation.mutate({
      sessionId,
      command: cmd + '\n',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCommand.trim()) return;

    addLine('command', `$ ${currentCommand}`);
    setCommandHistory((prev) => [...prev, currentCommand]);
    setHistoryIndex(-1);

    if (mode === 'ssh' && sshConnected) {
      executeSSHCommand(currentCommand);
    } else {
      executeLocalCommand(currentCommand);
    }

    setCurrentCommand('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentCommand('');
        } else {
          setHistoryIndex(newIndex);
          setCurrentCommand(commandHistory[newIndex]);
        }
      }
    }
  };

  const handleSSHConnect = () => {
    if (!sshHost || !sshUsername) {
      toast.error('Please fill in host and username');
      return;
    }

    addLine('output', `Connecting to ${sshUsername}@${sshHost}:${sshPort}...`);
    
    connectMutation.mutate({
      sessionId,
      host: sshHost,
      port: parseInt(sshPort),
      username: sshUsername,
      password: sshPassword || undefined,
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-black text-green-400 p-8">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⌨️</div>
          <h2 className="text-2xl font-semibold mb-2">Terminal</h2>
          <p className="text-green-400/70 mb-6">
            Please login to use terminal and SSH features
          </p>
          <Button onClick={() => window.location.href = getLoginUrl()}>
            Login to Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-black text-green-400 font-mono text-sm">
      {/* Terminal Output */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-auto p-4 space-y-1"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line, index) => (
          <div
            key={index}
            className={`whitespace-pre-wrap ${
              line.type === 'command'
                ? 'text-green-300'
                : line.type === 'error'
                ? 'text-red-400'
                : 'text-green-400'
            }`}
          >
            {line.text}
          </div>
        ))}
      </div>

      {/* SSH Connection Form */}
      {showSSHForm && !sshConnected && (
        <div className="absolute inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 bg-gray-900 border-green-500">
            <h3 className="text-lg font-semibold mb-4 text-green-400">SSH Connection</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block text-green-400">Host</label>
                <Input
                  placeholder="example.com"
                  value={sshHost}
                  onChange={(e) => setSshHost(e.target.value)}
                  className="bg-black text-green-400 border-green-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block text-green-400">Port</label>
                <Input
                  placeholder="22"
                  value={sshPort}
                  onChange={(e) => setSshPort(e.target.value)}
                  className="bg-black text-green-400 border-green-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block text-green-400">Username</label>
                <Input
                  placeholder="root"
                  value={sshUsername}
                  onChange={(e) => setSshUsername(e.target.value)}
                  className="bg-black text-green-400 border-green-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block text-green-400">Password</label>
                <Input
                  type="password"
                  placeholder="Password"
                  value={sshPassword}
                  onChange={(e) => setSshPassword(e.target.value)}
                  className="bg-black text-green-400 border-green-500"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={handleSSHConnect}
                  disabled={connectMutation.isPending}
                >
                  {connectMutation.isPending ? 'Connecting...' : 'Connect'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowSSHForm(false)}
                  className="border-green-500 text-green-400"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Command Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-green-900">
        <div className="flex items-center gap-2">
          <span className="text-green-300">
            {sshConnected ? `${sshUsername}@${sshHost}` : 'user@macos26'}:~$
          </span>
          <input
            ref={inputRef}
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-green-400"
            autoFocus
          />
        </div>
      </form>
    </div>
  );
};
