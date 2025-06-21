// src/components/NoteListItem.tsx
'use client';

import { Note } from '@/context/NotesContext';

interface NoteListItemProps {
  note: Note;
  isSelected: boolean;
  onClick: () => void;
}

const NoteListItem = ({ note, isSelected, onClick }: NoteListItemProps) => {
  return (
    <li
      className={`note-list-item ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <h3>{note.title || 'untitled note'}</h3>
      <p>{note.content || 'no additional content'}</p>
    </li>
  );
};

export default NoteListItem;