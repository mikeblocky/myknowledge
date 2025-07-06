// src/components/NoteCard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useNotes, Note, Tag } from '@/context/NotesContext';
import { ArrowLeft, Pin, Trash2 } from 'lucide-react';
import TagSelector from './TagSelector';
import { motion } from 'framer-motion';

interface NoteCardProps {
  note: Note | null;
  onBack: () => void;
  onClose: () => void;
  isMobile: boolean;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onBack, onClose, isMobile }) => {
  const { tags, updateNote, deleteNote, togglePinNote } = useNotes();
  const [title, setTitle] = useState(note ? note.title : '');
  const [content, setContent] = useState(note ? note.content : '');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      const noteTags = tags.filter(t => note.tagIds.includes(t._id));
      setSelectedTags(noteTags);
    }
  }, [note, tags]);

  if (!note) return null;

  const handleSave = () => {
    const tagIds = selectedTags.map(tag => tag._id);
    const updatedNote = { ...note, title, content, tagIds };
    updateNote(updatedNote);
    onClose();
  };

  const handleDelete = () => {
    deleteNote(note._id);
    onClose();
  }

  return (
    <motion.div 
      className="note-card-container"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <div className="note-card-header">
        {isMobile && <button onClick={onBack} className="icon-button"><ArrowLeft size={20}/></button>}
        <button 
          onClick={() => togglePinNote(note._id)} 
          className={`icon-button ${note.isPinned ? 'pinned' : ''}`}
          title={note.isPinned ? "Unpin note" : "Pin note"}
        >
            <Pin size={18} />
        </button>
        <button 
          onClick={handleDelete} 
          className="icon-button destructive"
          title="Delete note"
        >
            <Trash2 size={18} />
        </button>
      </div>
      <div className="note-card-content">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note Title"
          className="note-title-input"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing..."
          className="note-content-input"
        />
      </div>
      <div className="note-card-footer">
          <TagSelector 
              selectedTagIds={selectedTags.map(t => t._id)}
              onTagChange={(newTagIds) => {
                  const newTags = tags.filter(t => newTagIds.includes(t._id));
                  setSelectedTags(newTags);
              }}
          />
          <button onClick={handleSave} className="save-button">Save Changes</button>
      </div>
    </motion.div>
  );
};

export default NoteCard;

// Add some specific styles for this component to globals.css if they don't exist
// .note-card-display { ... }
// .note-card-header { display: flex; justify-content: space-between; align-items: flex-start; }
// .note-card-actions { display: flex; gap: 0.5rem; }
// .icon-button.destructive { color: var(--destructive-accent); }
// .note-card-date { color: var(--text-subtle); font-size: 0.8rem; margin: 0.25rem 0 1.5rem; }
// .note-card-divider { border: none; border-top: 1px solid var(--border-color); margin-bottom: 1.5rem; }
// .note-card-content { line-height: 1.7; }