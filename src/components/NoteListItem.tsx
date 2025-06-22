// src/components/NoteListItem.tsx
'use client';

import React from 'react';
import { Note, useNotes, Tag } from '@/context/NotesContext';
import { Pin, Calendar, Sparkles, Trash2, FilePenLine } from 'lucide-react';
import TagPill from './TagPill';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

interface NoteListItemProps {
  note: Note;
  isSelected: boolean;
  onSelect: () => void;
  onPinToggle: () => void;
}

export default function NoteListItem({ note, isSelected, onSelect, onPinToggle }: NoteListItemProps) {
  const { tags } = useNotes();
  const date = new Date(note.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const noteTags = tags.filter(tag => note.tagIds.includes(tag.id));

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
      <div className="note-list-item-date">{format(new Date(note.date), 'MMM d')}</div>
      <div className="note-list-item-preview">{note.content.substring(0, 80)}</div>
      {noteTags.length > 0 && (
        <div className="note-list-item-tags">
          {noteTags.slice(0, 3).map(tag => (
            <TagPill key={tag.id} tag={tag} />
          ))}
        </div>
      )}
    </motion.li>
  );
}