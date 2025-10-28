import React, { useState, useRef } from 'react';
import { Upload, Trash2, Download, ZoomIn, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Photo {
  id: string;
  url: string;
  name: string;
  date: Date;
}

export const Photos: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newPhoto: Photo = {
            id: Date.now().toString() + Math.random(),
            url: event.target?.result as string,
            name: file.name,
            date: new Date(),
          };
          setPhotos((prev) => [newPhoto, ...prev]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDelete = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    if (selectedPhoto?.id === id) {
      setSelectedPhoto(null);
    }
  };

  const handleDownload = (photo: Photo) => {
    const link = document.createElement('a');
    link.href = photo.url;
    link.download = photo.name;
    link.click();
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-border/50 bg-muted/30">
        <h2 className="text-lg font-semibold">Photos</h2>
        <Button
          onClick={() => fileInputRef.current?.click()}
          size="sm"
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          Import Photos
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Photo Grid */}
      <div className="flex-1 overflow-auto p-4">
        {photos.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
            <Upload className="h-16 w-16 mb-4 opacity-50" />
            <p className="text-lg">No photos yet</p>
            <p className="text-sm">Click "Import Photos" to add some</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer group"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(photo.id);
                    }}
                    className="text-white hover:bg-white/20"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Photo Viewer Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 text-white hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-4 absolute bottom-4 left-1/2 -translate-x-1/2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleDownload(selectedPhoto)}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(selectedPhoto.id)}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
          <img
            src={selectedPhoto.url}
            alt={selectedPhoto.name}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
};
