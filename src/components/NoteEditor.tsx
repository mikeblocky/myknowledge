'use client';

import { useState, useEffect } from 'react';
import { Note, useNotes } from '@/context/NotesContext';

interface NoteEditorProps {
  note: Note | undefined;
  onClose: () => void;
  // Add onSave, onDelete, etc. as needed
}

export default function NoteEditor({ note, onClose }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  return (
    <div className="note-editor-modal">
      <h2>{note ? 'Edit Note' : 'New Note'}</h2>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title"
      />
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Content"
      />
      <button onClick={onClose}>Close</button>
      {/* Add Save/Delete buttons and handlers as needed */}
    </div>
  );
}