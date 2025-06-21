// src/components/NoteCard.tsx
'use client';

import { Note } from '@/context/NotesContext';
import React from 'react';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
}

const NoteCard = ({ note, onEdit, onDelete }: NoteCardProps) => {
  const formattedDate = new Date(note.date).toLocaleDateString('en-us', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    // We use a new class to avoid conflicts with any old styles
    <article className="note-card-display">
      <header className="note-card-header">
        <h3>{note.title}</h3>
        <div className="note-card-actions">
          <button onClick={() => onEdit(note)}>edit</button>
          <button onClick={() => onDelete(note.id)}>delete</button>
        </div>
      </header>
      <div className="note-card-content">
        <p>{note.content}</p>
      </div>
      <footer className="note-card-footer">
        last updated: {formattedDate}
      </footer>
    </article>
  );
};

export default NoteCard;