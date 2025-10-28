import { Client } from 'ssh2';
import { EventEmitter } from 'events';

export interface SSHConnectionConfig {
  host: string;
  port: number;
  username: string;
  password?: string;
  privateKey?: string;
}

export interface SSHSession {
  id: string;
  config: SSHConnectionConfig;
  client: Client;
  stream: any;
  emitter: EventEmitter;
}

const sessions = new Map<string, SSHSession>();

export async function createSSHConnection(
  sessionId: string,
  config: SSHConnectionConfig
): Promise<{ success: boolean; error?: string }> {
  return new Promise((resolve) => {
    const client = new Client();
    const emitter = new EventEmitter();

    client.on('ready', () => {
      client.shell((err: Error | undefined, stream: any) => {
        if (err) {
          resolve({ success: false, error: err.message });
          return;
        }

        const session: SSHSession = {
          id: sessionId,
          config,
          client,
          stream,
          emitter,
        };

        sessions.set(sessionId, session);

        stream.on('data', (data: Buffer) => {
          emitter.emit('data', data.toString('utf-8'));
        });

        stream.on('close', () => {
          emitter.emit('close');
          sessions.delete(sessionId);
        });

        resolve({ success: true });
      });
    });

    client.on('error', (err: Error) => {
      resolve({ success: false, error: err.message });
    });

    const connectionConfig: any = {
      host: config.host,
      port: config.port,
      username: config.username,
    };

    if (config.password) {
      connectionConfig.password = config.password;
    }

    if (config.privateKey) {
      connectionConfig.privateKey = config.privateKey;
    }

    client.connect(connectionConfig);
  });
}

export function sendSSHCommand(sessionId: string, command: string): boolean {
  const session = sessions.get(sessionId);
  if (!session || !session.stream) {
    return false;
  }

  session.stream.write(command);
  return true;
}

export function closeSSHConnection(sessionId: string): boolean {
  const session = sessions.get(sessionId);
  if (!session) {
    return false;
  }

  if (session.stream) {
    session.stream.end();
  }
  
  session.client.end();
  sessions.delete(sessionId);
  return true;
}

export function getSSHSession(sessionId: string): SSHSession | undefined {
  return sessions.get(sessionId);
}

export function resizeSSHTerminal(
  sessionId: string,
  rows: number,
  cols: number
): boolean {
  const session = sessions.get(sessionId);
  if (!session || !session.stream) {
    return false;
  }

  session.stream.setWindow(rows, cols);
  return true;
}
