import React, { useState } from 'react';
import { Folder, File, Home, Star, Clock, Trash2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  size?: string;
  modified: string;
  children?: FileItem[];
}

const mockFiles: FileItem[] = [
  {
    id: '1',
    name: 'Documents',
    type: 'folder',
    modified: 'Today, 10:30 AM',
    children: [
      { id: '1-1', name: 'Resume.pdf', type: 'file', size: '245 KB', modified: 'Yesterday' },
      { id: '1-2', name: 'Project.docx', type: 'file', size: '1.2 MB', modified: '2 days ago' },
    ],
  },
  {
    id: '2',
    name: 'Downloads',
    type: 'folder',
    modified: 'Today, 9:15 AM',
    children: [
      { id: '2-1', name: 'image.png', type: 'file', size: '3.4 MB', modified: 'Today' },
    ],
  },
  {
    id: '3',
    name: 'Desktop',
    type: 'folder',
    modified: 'Yesterday',
    children: [],
  },
  {
    id: '4',
    name: 'Applications',
    type: 'folder',
    modified: 'Last week',
    children: [],
  },
];

export const Finder: React.FC = () => {
  const [currentFolder, setCurrentFolder] = useState<FileItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const displayItems = currentFolder ? currentFolder.children || [] : mockFiles;

  return (
    <div className="h-full flex bg-background">
      {/* Sidebar */}
      <div className="w-48 border-r border-border/50 bg-muted/30 p-2">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-muted-foreground px-2 py-1">Favorites</div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={() => setCurrentFolder(null)}
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
            <Star className="h-4 w-4" />
            Favorites
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
            <Clock className="h-4 w-4" />
            Recents
          </Button>
          <div className="text-xs font-semibold text-muted-foreground px-2 py-1 mt-4">Locations</div>
          {mockFiles.map((folder) => (
            <Button
              key={folder.id}
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={() => setCurrentFolder(folder)}
            >
              <Folder className="h-4 w-4" />
              {folder.name}
            </Button>
          ))}
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
            <Trash2 className="h-4 w-4" />
            Trash
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 p-3 border-b border-border/50 bg-muted/30">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentFolder(null)}
            className="h-7"
          >
            Home
          </Button>
          {currentFolder && (
            <>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{currentFolder.name}</span>
            </>
          )}
        </div>

        {/* File List */}
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="bg-muted/30 sticky top-0">
              <tr className="text-left text-sm border-b border-border/50">
                <th className="p-3 font-medium">Name</th>
                <th className="p-3 font-medium">Modified</th>
                <th className="p-3 font-medium">Size</th>
              </tr>
            </thead>
            <tbody>
              {displayItems.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-muted-foreground">
                    This folder is empty
                  </td>
                </tr>
              ) : (
                displayItems.map((item) => (
                  <tr
                    key={item.id}
                    className={`border-b border-border/30 hover:bg-muted/30 cursor-pointer ${
                      selectedItem === item.id ? 'bg-primary/10' : ''
                    }`}
                    onClick={() => setSelectedItem(item.id)}
                    onDoubleClick={() => {
                      if (item.type === 'folder') {
                        setCurrentFolder(item);
                      }
                    }}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {item.type === 'folder' ? (
                          <Folder className="h-5 w-5 text-blue-500" />
                        ) : (
                          <File className="h-5 w-5 text-muted-foreground" />
                        )}
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">{item.modified}</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {item.type === 'file' ? item.size : '--'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
