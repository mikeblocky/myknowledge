// src/components/NoteDisplay.tsx
'use client';

import { Note, useNotes } from '@/context/NotesContext';
import { format, isValid, parseISO } from 'date-fns';
import { Pin, Trash2, FilePenLine, Share2, Bookmark, MoreVertical, ArrowLeft, Heart, Clock, Calendar, Tag as TagIcon } from 'lucide-react';
import TagPill from './TagPill';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface NoteDisplayProps {
  note: Note;
  onEdit: () => void;
  onBack?: () => void;
}

export default function NoteDisplay({ note, onEdit, onBack }: NoteDisplayProps) {
  const { tags, togglePinNote, deleteNote } = useNotes();
  const isMobile = useMediaQuery('(max-width: 600px)');
  const [showActions, setShowActions] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const touchStartRef = useRef<number | null>(null);
  const touchEndRef = useRef<number | null>(null);

  const rawDate: Date | null = note.date
    ? typeof note.date === 'string'
      ? parseISO(note.date)
      : new Date(note.date)
    : null;

  const formattedDate =
    rawDate && isValid(rawDate) ? format(rawDate, 'MMMM d, yyyy') : 'No date';
  
  const formattedTime = 
    rawDate && isValid(rawDate) ? format(rawDate, 'h:mm a') : '';

  const noteTags = tags.filter(tag => note.tagIds.includes(tag._id));

  // Touch gesture handling for swipe actions
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current || !touchEndRef.current) return;
    
    const distance = touchStartRef.current - touchEndRef.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && onBack) {
      onBack();
    } else if (isRightSwipe) {
      setShowActions(true);
    }

    touchStartRef.current = null;
    touchEndRef.current = null;
  };

  // Auto-hide actions after 3 seconds
  useEffect(() => {
    if (showActions) {
      const timer = setTimeout(() => setShowActions(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showActions]);

  if (isMobile) {
    return (
      <motion.div 
        className="mobile-note-display"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Mobile Header Bar */}
        <motion.div 
          className="mobile-note-header"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="mobile-header-left">
            <div className="mobile-note-title">
              <h1>{note.title || 'Untitled Note'}</h1>
              <div className="mobile-note-meta">
                <span className="mobile-note-date">
                  <Calendar size={14} />
                  {formattedDate}
                </span>
                {formattedTime && (
                  <span className="mobile-note-time">
                    <Clock size={14} />
                    {formattedTime}
                  </span>
                )}
              </div>
              {/* Tags moved here, right after title and meta */}
              {noteTags.length > 0 && (
                <div className="mobile-note-tags">
                  <div className="mobile-tags-header">
                    <TagIcon size={14} />
                    <span>Tags</span>
                  </div>
                  <div className="mobile-tags-list">
                    {noteTags.map(tag => (
                      <TagPill key={tag._id} tag={tag} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Content Section */}
        <motion.div 
          className="mobile-note-content"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mobile-content-wrapper">
            {note.content ? (
              <ReactMarkdown>{note.content}</ReactMarkdown>
            ) : (
              <p style={{ color: 'var(--text-subtle)', fontStyle: 'italic' }}>
                No content available for this note.
              </p>
            )}
          </div>
        </motion.div>

        {/* Mobile Action Bar - Fixed at bottom above tabs */}
        <div className="mobile-action-bar">
          <div className="mobile-action-bar-content">
            <button 
              className="mobile-action-bar-btn primary"
              onClick={onEdit}
              title="Edit note"
            >
              <FilePenLine size={18} />
              <span>Edit</span>
            </button>
            <button 
              className={`mobile-action-bar-btn ${note.isPinned ? 'pinned' : ''}`}
              onClick={() => togglePinNote(note._id)}
              title={note.isPinned ? "Unpin note" : "Pin note"}
            >
              <Pin size={18} />
              <span>{note.isPinned ? 'Pinned' : 'Pin'}</span>
            </button>
            <button 
              className="mobile-action-bar-btn destructive"
              onClick={() => {
                if (confirm('Are you sure you want to delete this note?')) {
                  deleteNote(note._id);
                }
              }}
              title="Delete note"
            >
              <Trash2 size={18} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Desktop version (simplified but modern)
  return (
    <motion.div 
      className="desktop-note-display"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="desktop-note-header">
        <div className="desktop-header-content">
          <h1>{note.title || 'Untitled Note'}</h1>
          <div className="desktop-note-meta">
            <span className="desktop-note-date">
              <Calendar size={16} />
              {formattedDate}
            </span>
            {formattedTime && (
              <span className="desktop-note-time">
                <Clock size={16} />
                {formattedTime}
              </span>
            )}
          </div>
        </div>
        
        <div className="desktop-header-actions">
          <button 
            onClick={() => togglePinNote(note._id)} 
            className={`desktop-action-btn ${note.isPinned ? 'pinned' : ''}`}
            title={note.isPinned ? "Unpin note" : "Pin note"}
          >
            <Pin size={18} />
          </button>
          <button onClick={onEdit} className="desktop-action-btn" title="Edit note">
            <FilePenLine size={18} />
          </button>
          <button 
            onClick={() => {
              if (confirm('Are you sure you want to delete this note?')) {
                deleteNote(note._id);
              }
            }} 
            className="desktop-action-btn destructive"
            title="Delete note"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {noteTags.length > 0 && (
        <div className="desktop-tags-section">
          <div className="desktop-tags-header">
            <TagIcon size={16} />
            <span>Tags</span>
          </div>
          <div className="desktop-tags-list">
            {noteTags.map(tag => <TagPill key={tag._id} tag={tag} />)}
          </div>
        </div>
      )}

      <div className="desktop-note-content">
        <ReactMarkdown>{note.content}</ReactMarkdown>
      </div>
    </motion.div>
  );
} 