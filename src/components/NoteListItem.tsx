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

  const handlePinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPinToggle();
  };

  return (
    <motion.div
      className={`note-card ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
      onDoubleClick={onDoubleClick}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <div className="note-card-header">
        <button 
          className={`note-card-action-btn pin-btn ${note.isPinned ? 'pinned' : ''}`}
          onClick={handlePinClick}
          title={note.isPinned ? 'Unpin note' : 'Pin note'}
        >
          <Pin size={16} />
        </button>
        <div className="note-card-meta">
          <span className="note-card-date">
            <Calendar size={14} />
            {formattedDate}
          </span>
        </div>
      </div>
      
      <div className="note-card-title">{note.title || 'Untitled Note'}</div>
      
      {noteTags.length > 0 && (
        <div className="note-card-tags">
          {noteTags.slice(0, 3).map(tag => (
            <TagPill key={tag._id} tag={tag} />
          ))}
          {noteTags.length > 3 && (
            <span className="note-card-tags-more">+{noteTags.length - 3}</span>
          )}
        </div>
      )}
    </motion.div>
  );
}

