'use client';

import { useState, useEffect } from 'react';
import { Note, useNotes } from '@/context/NotesContext';
import TagPill from './TagPill';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, X, Tag, Type, FileText } from 'lucide-react';

interface NoteModalProps {
  note: Note | null;
  onSave: (note: { title: string; content: string; tagIds: string[] }) => void;
  onClose: () => void;
}

export default function NoteModal({ note, onSave, onClose }: NoteModalProps) {
  const { tags } = useNotes();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setSelectedTagIds(note.tagIds);
    } else {
      setTitle('');
      setContent('');
      setSelectedTagIds([]);
    }
  }, [note]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
        alert("Title is required.");
        return;
    };
    onSave({ title, content, tagIds: selectedTagIds });
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTagIds(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <motion.div 
      className="modal-overlay" 
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
      >
        <div className="modal-header">
          <h2>{note ? 'Edit Note' : 'Create New Note'}</h2>
          <button className="modal-close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form className="note-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title"><Type size={14}/> Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Your note title"
              required
            />
          </div>
          
          <div className="form-group">
            <label><Tag size={14}/> Tags</label>
            <div className="tags-list">
              {tags.map(tag => (
                <TagPill
                  key={tag._id}
                  tag={tag}
                  isSelected={selectedTagIds.includes(tag._id)}
                  onClick={() => handleTagToggle(tag._id)}
                />
              ))}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="content"><FileText size={14}/> Content</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing..."
              rows={12}
            />
          </div>
          
          <div className="form-actions">
            <button type="button" className="form-button secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="form-button primary">
              <Save size={16} />
              Save Note
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
} 