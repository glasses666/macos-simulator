import React, { useState } from 'react';
import { Play, Square, Trash2, Download, Terminal, RefreshCw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';

export const Docker: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [showAll, setShowAll] = useState(false);
  const [selectedContainer, setSelectedContainer] = useState<string | null>(null);
  const [newImageName, setNewImageName] = useState('');
  const [runConfig, setRunConfig] = useState({ image: '', name: '', ports: '' });
  const [showRunDialog, setShowRunDialog] = useState(false);

  const utils = trpc.useUtils();
  
  const { data: containers = [], isLoading: containersLoading } = trpc.docker.listContainers.useQuery(
    { all: showAll },
    { enabled: isAuthenticated, refetchInterval: 3000 }
  );
  
  const { data: images = [], isLoading: imagesLoading } = trpc.docker.listImages.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const { data: logs } = trpc.docker.getContainerLogs.useQuery(
    { containerId: selectedContainer!, tail: 100 },
    { enabled: !!selectedContainer && isAuthenticated }
  );

  const startMutation = trpc.docker.startContainer.useMutation({
    onSuccess: () => {
      toast.success('Container started successfully');
      utils.docker.listContainers.invalidate();
    },
    onError: (error) => toast.error(`Failed to start: ${error.message}`),
  });

  const stopMutation = trpc.docker.stopContainer.useMutation({
    onSuccess: () => {
      toast.success('Container stopped successfully');
      utils.docker.listContainers.invalidate();
    },
    onError: (error) => toast.error(`Failed to stop: ${error.message}`),
  });

  const removeMutation = trpc.docker.removeContainer.useMutation({
    onSuccess: () => {
      toast.success('Container removed successfully');
      utils.docker.listContainers.invalidate();
    },
    onError: (error) => toast.error(`Failed to remove: ${error.message}`),
  });

  const pullMutation = trpc.docker.pullImage.useMutation({
    onSuccess: () => {
      toast.success('Image pulled successfully');
      utils.docker.listImages.invalidate();
      setNewImageName('');
    },
    onError: (error) => toast.error(`Failed to pull: ${error.message}`),
  });

  const runMutation = trpc.docker.runContainer.useMutation({
    onSuccess: () => {
      toast.success('Container started successfully');
      utils.docker.listContainers.invalidate();
      setShowRunDialog(false);
      setRunConfig({ image: '', name: '', ports: '' });
    },
    onError: (error) => toast.error(`Failed to run: ${error.message}`),
  });

  if (!isAuthenticated) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-background p-8">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🐳</div>
          <h2 className="text-2xl font-semibold mb-2">Docker Management</h2>
          <p className="text-muted-foreground mb-6">
            Please login to manage Docker containers and images
          </p>
          <Button onClick={() => window.location.href = getLoginUrl()}>
            Login to Continue
          </Button>
        </div>
      </div>
    );
  }

  if (selectedContainer) {
    return (
      <div className="h-full flex flex-col bg-background">
        <div className="p-3 border-b border-border/50 bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            <span className="font-semibold">Container Logs</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setSelectedContainer(null)}>
            Close
          </Button>
        </div>
        <div className="flex-1 overflow-auto p-4 bg-black text-green-400 font-mono text-sm">
          <pre className="whitespace-pre-wrap">{logs || 'Loading logs...'}</pre>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border/50 bg-muted/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <span className="text-2xl">🐳</span>
              Docker Desktop
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage containers and images
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                utils.docker.listContainers.invalidate();
                utils.docker.listImages.invalidate();
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {/* Containers Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Containers</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? 'Show Running' : 'Show All'}
              </Button>
              <Button
                size="sm"
                onClick={() => setShowRunDialog(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Run Container
              </Button>
            </div>
          </div>

          {containersLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading containers...</div>
          ) : containers.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              <p>No containers found</p>
            </Card>
          ) : (
            <div className="space-y-2">
              {containers.map((container) => (
                <Card key={container.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{container.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          container.status.includes('Up') 
                            ? 'bg-green-500/20 text-green-500' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {container.status}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {container.image}
                      </div>
                      {container.ports && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Ports: {container.ports}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {container.status.includes('Up') ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedContainer(container.id)}
                          >
                            <Terminal className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => stopMutation.mutate({ containerId: container.id })}
                            disabled={stopMutation.isPending}
                          >
                            <Square className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startMutation.mutate({ containerId: container.id })}
                          disabled={startMutation.isPending}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeMutation.mutate({ containerId: container.id })}
                        disabled={removeMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Images Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Images</h3>
          
          <div className="flex gap-2 mb-3">
            <Input
              placeholder="Pull image (e.g., nginx:latest)"
              value={newImageName}
              onChange={(e) => setNewImageName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newImageName) {
                  pullMutation.mutate({ image: newImageName });
                }
              }}
            />
            <Button
              onClick={() => newImageName && pullMutation.mutate({ image: newImageName })}
              disabled={!newImageName || pullMutation.isPending}
            >
              <Download className="h-4 w-4 mr-2" />
              Pull
            </Button>
          </div>

          {imagesLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading images...</div>
          ) : images.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              <p>No images found</p>
            </Card>
          ) : (
            <div className="space-y-2">
              {images.map((image) => (
                <Card key={image.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">
                        {image.repository}:{image.tag}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Size: {image.size} • Created: {image.created}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setRunConfig({ ...runConfig, image: `${image.repository}:${image.tag}` });
                        setShowRunDialog(true);
                      }}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Run
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Run Container Dialog */}
      {showRunDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Run Container</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Image</label>
                <Input
                  placeholder="nginx:latest"
                  value={runConfig.image}
                  onChange={(e) => setRunConfig({ ...runConfig, image: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Container Name (optional)</label>
                <Input
                  placeholder="my-container"
                  value={runConfig.name}
                  onChange={(e) => setRunConfig({ ...runConfig, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Port Mapping (optional)</label>
                <Input
                  placeholder="8080:80"
                  value={runConfig.ports}
                  onChange={(e) => setRunConfig({ ...runConfig, ports: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => runMutation.mutate(runConfig)}
                  disabled={!runConfig.image || runMutation.isPending}
                >
                  Run
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRunDialog(false);
                    setRunConfig({ image: '', name: '', ports: '' });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
