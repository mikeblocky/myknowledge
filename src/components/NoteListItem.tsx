// src/components/NoteListItem.tsx
'use client';

<<<<<<< HEAD
import React, { useState } from 'react';
=======
import React from 'react';
>>>>>>> c1fb7f2977895023cc5098c75439c805d43925fa
import { Note, useNotes, Tag } from '@/context/NotesContext';
import { Pin, Calendar, Sparkles, Trash2, FilePenLine } from 'lucide-react';
import TagPill from './TagPill';
import { motion, AnimatePresence } from 'framer-motion';
<<<<<<< HEAD
import { format, isValid } from 'date-fns';
=======
import { format } from 'date-fns';
>>>>>>> c1fb7f2977895023cc5098c75439c805d43925fa

interface NoteListItemProps {
  note: Note;
  isSelected: boolean;
  onSelect: () => void;
  onPinToggle: () => void;
}

export default function NoteListItem({ note, isSelected, onSelect, onPinToggle }: NoteListItemProps) {
  const { tags } = useNotes();
<<<<<<< HEAD
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
=======
  const date = new Date(note.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const noteTags = tags.filter(tag => note.tagIds.includes(tag.id));
>>>>>>> c1fb7f2977895023cc5098c75439c805d43925fa

  const handlePinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPinToggle();
  };

  return (
    <motion.li
      className={`note-list-item ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
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
<<<<<<< HEAD
      <div className="note-list-item-date">{formattedDate}</div>
=======
      <div className="note-list-item-date">{format(new Date(note.date), 'MMM d')}</div>
>>>>>>> c1fb7f2977895023cc5098c75439c805d43925fa
      <div className="note-list-item-preview">{note.content.substring(0, 80)}</div>
      {noteTags.length > 0 && (
        <div className="note-list-item-tags">
          {noteTags.slice(0, 3).map(tag => (
<<<<<<< HEAD
            <TagPill key={tag._id} tag={tag} />
=======
            <TagPill key={tag.id} tag={tag} />
>>>>>>> c1fb7f2977895023cc5098c75439c805d43925fa
          ))}
        </div>
      )}
    </motion.li>
  );
<<<<<<< HEAD
}

=======
}
>>>>>>> c1fb7f2977895023cc5098c75439c805d43925fa
