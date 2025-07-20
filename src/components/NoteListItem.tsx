// src/components/NoteListItem.tsx
'use client';

import React, { useState } from 'react';
import { Note, useNotes, Tag } from '@/context/NotesContext';
import { Pin, Calendar, Sparkles, Trash2, FilePenLine } from 'lucide-react';
import TagPill from './TagPill';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isValid } from 'date-fns';

interface NoteListItemProps {
  note: Note;
  isSelected: boolean;
  onSelect: () => void;
  onPinToggle: () => void;
  onDoubleClick?: () => void;
}

export default function NoteListItem({ note, isSelected, onSelect, onPinToggle, onDoubleClick }: NoteListItemProps) {
  const { tags } = useNotes();
  const rawDate = note.date ? new Date(note.date) : null;
  const formattedDate =
    rawDate && isValid(rawDate) ? format(rawDate, 'MMM d') : 'No date';

  const noteTags = tags.filter(tag => note.tagIds.includes(tag._id));

  // Usage example with the suggested code change
const exampleNote: Note = {
  _id: '1',
  title: 'Sample Note',
  content: 'This is a sample note content.',
  date: new Date().toISOString(),
  isPinned: false,
  tagIds: [],
};

// In a component
<NoteListItem 
  note={exampleNote} 
  isSelected={true} 
  onSelect={() => {}} 
  onPinToggle={() => {}}
/>

  const handlePinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPinToggle();
  };

  return (
    <motion.li
      className={`note-list-item ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
      onDoubleClick={onDoubleClick}
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button 
        className={`pin-button ${note.isPinned ? 'pinned' : ''}`}
        onClick={handlePinClick}
      >
        <Pin size={16} />
      </button>
      <div className="note-list-item-title">{note.title || 'Untitled Note'}</div>
      <div className="note-list-item-date">{formattedDate}</div>
      {/* Removed content preview */}
      {noteTags.length > 0 && (
        <div className="note-list-item-tags">
          {noteTags.slice(0, 3).map(tag => (
            <TagPill key={tag._id} tag={tag} />
          ))}
        </div>
      )}
    </motion.li>
  );
}

