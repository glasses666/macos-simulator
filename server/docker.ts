import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface DockerContainer {
  id: string;
  name: string;
  image: string;
  status: string;
  created: string;
  ports: string;
}

export interface DockerImage {
  id: string;
  repository: string;
  tag: string;
  size: string;
  created: string;
}

export async function listContainers(all: boolean = false): Promise<DockerContainer[]> {
  try {
    const cmd = all ? 'docker ps -a --format json' : 'docker ps --format json';
    const { stdout } = await execAsync(cmd);
    
    if (!stdout.trim()) return [];
    
    const lines = stdout.trim().split('\n');
    return lines.map(line => {
      const container = JSON.parse(line);
      return {
        id: container.ID,
        name: container.Names,
        image: container.Image,
        status: container.Status,
        created: container.CreatedAt,
        ports: container.Ports || '',
      };
    });
  } catch (error: any) {
    console.error('Error listing containers:', error);
    throw new Error(`Failed to list containers: ${error.message}`);
  }
}

export async function listImages(): Promise<DockerImage[]> {
  try {
    const { stdout } = await execAsync('docker images --format json');
    
    if (!stdout.trim()) return [];
    
    const lines = stdout.trim().split('\n');
    return lines.map(line => {
      const image = JSON.parse(line);
      return {
        id: image.ID,
        repository: image.Repository,
        tag: image.Tag,
        size: image.Size,
        created: image.CreatedAt,
      };
    });
  } catch (error: any) {
    console.error('Error listing images:', error);
    throw new Error(`Failed to list images: ${error.message}`);
  }
}

export async function startContainer(containerId: string): Promise<void> {
  try {
    await execAsync(`docker start ${containerId}`);
  } catch (error: any) {
    console.error('Error starting container:', error);
    throw new Error(`Failed to start container: ${error.message}`);
  }
}

export async function stopContainer(containerId: string): Promise<void> {
  try {
    await execAsync(`docker stop ${containerId}`);
  } catch (error: any) {
    console.error('Error stopping container:', error);
    throw new Error(`Failed to stop container: ${error.message}`);
  }
}

export async function removeContainer(containerId: string): Promise<void> {
  try {
    await execAsync(`docker rm -f ${containerId}`);
  } catch (error: any) {
    console.error('Error removing container:', error);
    throw new Error(`Failed to remove container: ${error.message}`);
  }
}

export async function runContainer(image: string, name?: string, ports?: string): Promise<string> {
  try {
    let cmd = 'docker run -d';
    if (name) cmd += ` --name ${name}`;
    if (ports) cmd += ` -p ${ports}`;
    cmd += ` ${image}`;
    
    const { stdout } = await execAsync(cmd);
    return stdout.trim();
  } catch (error: any) {
    console.error('Error running container:', error);
    throw new Error(`Failed to run container: ${error.message}`);
  }
}

export async function pullImage(image: string): Promise<void> {
  try {
    await execAsync(`docker pull ${image}`);
  } catch (error: any) {
    console.error('Error pulling image:', error);
    throw new Error(`Failed to pull image: ${error.message}`);
  }
}

export async function getContainerLogs(containerId: string, tail: number = 100): Promise<string> {
  try {
    const { stdout } = await execAsync(`docker logs --tail ${tail} ${containerId}`);
    return stdout;
  } catch (error: any) {
    console.error('Error getting container logs:', error);
    throw new Error(`Failed to get container logs: ${error.message}`);
  }
}

export async function execInContainer(containerId: string, command: string): Promise<string> {
  try {
    const { stdout } = await execAsync(`docker exec ${containerId} ${command}`);
    return stdout;
  } catch (error: any) {
    console.error('Error executing command in container:', error);
    throw new Error(`Failed to execute command: ${error.message}`);
  }
}
