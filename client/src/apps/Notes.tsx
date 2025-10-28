import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface Note {
  id: string;
  title: string;
  content: string;
  date: Date;
}

export const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Welcome to Notes',
      content: 'This is your first note. Click on it to edit or create a new note using the + button.',
      date: new Date(),
    },
  ]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(notes[0]);

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      date: new Date(),
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
  };

  const updateNote = (id: string, title: string, content: string) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, title, content, date: new Date() } : note
    ));
  };

  const deleteNote = (id: string) => {
    const newNotes = notes.filter(note => note.id !== id);
    setNotes(newNotes);
    if (selectedNote?.id === id) {
      setSelectedNote(newNotes[0] || null);
    }
  };

  return (
    <div className="h-full flex bg-background">
      {/* Notes List */}
      <div className="w-64 border-r border-border/50 bg-muted/30 flex flex-col">
        <div className="p-3 border-b border-border/50 flex items-center justify-between">
          <h2 className="font-semibold">Notes</h2>
          <Button variant="ghost" size="icon" onClick={createNewNote} className="h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-auto">
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => setSelectedNote(note)}
              className={`p-3 border-b border-border/30 cursor-pointer hover:bg-muted/50 transition-colors ${
                selectedNote?.id === note.id ? 'bg-muted/70' : ''
              }`}
            >
              <div className="font-medium text-sm truncate">{note.title}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {note.date.toLocaleDateString()}
              </div>
              <div className="text-xs text-muted-foreground mt-1 truncate">
                {note.content || 'No additional text'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Note Editor */}
      <div className="flex-1 flex flex-col">
        {selectedNote ? (
          <>
            <div className="p-3 border-b border-border/50 bg-muted/30 flex items-center justify-between">
              <Input
                value={selectedNote.title}
                onChange={(e) => updateNote(selectedNote.id, e.target.value, selectedNote.content)}
                className="text-lg font-semibold border-0 bg-transparent focus-visible:ring-0 px-0"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteNote(selectedNote.id)}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 p-4">
              <Textarea
                value={selectedNote.content}
                onChange={(e) => updateNote(selectedNote.id, selectedNote.title, e.target.value)}
                placeholder="Start typing..."
                className="h-full resize-none border-0 focus-visible:ring-0 text-base"
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="text-lg mb-2">No note selected</p>
              <p className="text-sm">Create a new note or select one from the list</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
