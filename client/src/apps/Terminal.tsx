import React, { useState, useRef, useEffect } from 'react';

interface TerminalLine {
  type: 'command' | 'output';
  text: string;
}

export const Terminal: React.FC = () => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'output', text: 'macOS 26 Terminal - Type "help" for available commands' },
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    let output = '';

    switch (trimmedCmd) {
      case 'help':
        output = 'Available commands:\n  help - Show this help message\n  clear - Clear the terminal\n  date - Show current date and time\n  echo <text> - Print text\n  whoami - Display current user\n  uname - Show system information';
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
      default:
        if (trimmedCmd.startsWith('echo ')) {
          output = cmd.substring(5);
        } else if (trimmedCmd === '') {
          return;
        } else {
          output = `Command not found: ${cmd}. Type "help" for available commands.`;
        }
    }

    setLines((prev) => [
      ...prev,
      { type: 'command', text: cmd },
      { type: 'output', text: output },
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentCommand.trim()) {
      executeCommand(currentCommand);
      setCommandHistory((prev) => [...prev, currentCommand]);
      setHistoryIndex(-1);
      setCurrentCommand('');
    }
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

  return (
    <div
      className="h-full bg-black text-green-400 font-mono text-sm p-4 overflow-auto"
      ref={terminalRef}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="space-y-1">
        {lines.map((line, index) => (
          <div key={index} className={line.type === 'command' ? 'text-white' : 'text-green-400'}>
            {line.type === 'command' && <span className="text-blue-400">user@macos26</span>}
            {line.type === 'command' && <span className="text-white">:</span>}
            {line.type === 'command' && <span className="text-purple-400">~</span>}
            {line.type === 'command' && <span className="text-white">$ </span>}
            <span className="whitespace-pre-wrap">{line.text}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex items-center mt-1">
        <span className="text-blue-400">user@macos26</span>
        <span className="text-white">:</span>
        <span className="text-purple-400">~</span>
        <span className="text-white">$ </span>
        <input
          ref={inputRef}
          type="text"
          value={currentCommand}
          onChange={(e) => setCurrentCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-white ml-1"
          autoFocus
        />
      </form>
    </div>
  );
};
