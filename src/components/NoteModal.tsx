// src/components/NoteModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Note, useNotes } from '@/context/NotesContext';
import TagPill from './TagPill';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Save, X, Tag, Type, FileText, Plus, Palette } from 'lucide-react';

interface NoteModalProps {
  note: Note | null;
  onSave: (note: { title: string; content: string; tagIds: string[] }) => void;
  onClose: () => void;
}

export default function NoteModal({ note, onSave, onClose }: NoteModalProps) {
  const { tags, addTag } = useNotes();
  const isMobile = useMediaQuery('(max-width: 600px)');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#7C3AED');
  const [showColorPicker, setShowColorPicker] = useState(false);
  
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

  const handleAddTag = async () => {
    if (!newTagName.trim()) return;
    const newTag = await addTag(newTagName, newTagColor);
    setNewTagName('');
    setNewTagColor('#7C3AED');
    setSelectedTagIds(prev => [...prev, newTag._id]);
  };

  const colorOptions = [
    '#7C3AED', '#EF4444', '#F59E0B', '#10B981', 
    '#3B82F6', '#8B5CF6', '#EC4899', '#6B7280'
  ];

  if (isMobile) {
    return (
      <motion.div 
        className="mobile-modal-overlay" 
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div 
          className="mobile-modal-content" 
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
        >
          {/* Mobile Header */}
          <div className="mobile-modal-header">
            <h2>{note ? 'Edit Note' : 'New Note'}</h2>
            <button className="mobile-modal-close" onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          <form className="mobile-note-form" onSubmit={handleSubmit}>
            {/* Title Section */}
            <div className="mobile-form-section">
              <label className="mobile-form-label">
                <Type size={16} />
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title..."
                className="mobile-form-input"
                required
              />
            </div>

            {/* Tags Section */}
            <div className="mobile-form-section">
              <label className="mobile-form-label">
                <Tag size={16} />
                Tags
              </label>
              
              {/* Selected Tags */}
              {selectedTagIds.length > 0 && (
                <div className="mobile-selected-tags">
                  {tags.filter(tag => selectedTagIds.includes(tag._id)).map(tag => (
                    <TagPill
                      key={tag._id}
                      tag={tag}
                      isSelected={true}
                      onClick={() => handleTagToggle(tag._id)}
                    />
                  ))}
                </div>
              )}

              {/* Available Tags */}
              <div className="mobile-available-tags">
                {tags.filter(tag => !selectedTagIds.includes(tag._id)).map(tag => (
                  <TagPill
                    key={tag._id}
                    tag={tag}
                    isSelected={false}
                    onClick={() => handleTagToggle(tag._id)}
                  />
                ))}
              </div>

              {/* Add New Tag */}
              <div className="mobile-add-tag-section">
                <div className="mobile-add-tag-input">
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="New tag name"
                    className="mobile-form-input"
                  />
                  <button
                    type="button"
                    className="mobile-color-picker-btn"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    title="Choose color"
                  >
                    <Palette size={16} />
                  </button>
                  <button
                    type="button"
                    className="mobile-add-tag-btn"
                    onClick={handleAddTag}
                    disabled={!newTagName.trim()}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                {showColorPicker && (
                  <motion.div 
                    className="mobile-color-picker"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {colorOptions.map(color => (
                      <button
                        key={color}
                        type="button"
                        className={`mobile-color-option ${newTagColor === color ? 'selected' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewTagColor(color)}
                      />
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Content Section */}
            <div className="mobile-form-section">
              <label className="mobile-form-label">
                <FileText size={16} />
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing your note..."
                className="mobile-form-textarea"
                rows={8}
              />
            </div>

            {/* Mobile Actions */}
            <div className="mobile-form-actions">
              <button type="button" className="mobile-form-btn secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="mobile-form-btn primary">
                <Save size={16} />
                {note ? 'Update Note' : 'Create Note'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    );
  }

  // Desktop version - same as mobile but with larger dimensions
  return (
    <motion.div 
      className="mobile-modal-overlay" 
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div 
        className="desktop-modal-content" 
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
      >
        {/* Desktop Header */}
        <div className="mobile-modal-header">
          <h2>{note ? 'Edit Note' : 'New Note'}</h2>
          <button className="mobile-modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form className="mobile-note-form" onSubmit={handleSubmit}>
          {/* Title Section */}
          <div className="mobile-form-section">
            <label className="mobile-form-label">
              <Type size={16} />
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title..."
              className="mobile-form-input"
              required
            />
          </div>

          {/* Tags Section */}
          <div className="mobile-form-section">
            <label className="mobile-form-label">
              <Tag size={16} />
              Tags
            </label>
            
            {/* Selected Tags */}
            {selectedTagIds.length > 0 && (
              <div className="mobile-selected-tags">
                {tags.filter(tag => selectedTagIds.includes(tag._id)).map(tag => (
                  <TagPill
                    key={tag._id}
                    tag={tag}
                    isSelected={true}
                    onClick={() => handleTagToggle(tag._id)}
                  />
                ))}
              </div>
            )}

            {/* Available Tags */}
            <div className="mobile-available-tags">
              {tags.filter(tag => !selectedTagIds.includes(tag._id)).map(tag => (
                <TagPill
                  key={tag._id}
                  tag={tag}
                  isSelected={false}
                  onClick={() => handleTagToggle(tag._id)}
                />
              ))}
            </div>

            {/* Add New Tag */}
            <div className="mobile-add-tag-section">
              <div className="mobile-add-tag-input">
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="New tag name"
                  className="mobile-form-input"
                />
                <button
                  type="button"
                  className="mobile-color-picker-btn"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  title="Choose color"
                >
                  <Palette size={16} />
                </button>
                <button
                  type="button"
                  className="mobile-add-tag-btn"
                  onClick={handleAddTag}
                  disabled={!newTagName.trim()}
                >
                  <Plus size={16} />
                </button>
              </div>
              
              {showColorPicker && (
                <motion.div 
                  className="mobile-color-picker"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {colorOptions.map(color => (
                    <button
                      key={color}
                      type="button"
                      className={`mobile-color-option ${newTagColor === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewTagColor(color)}
                    />
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="mobile-form-section">
            <label className="mobile-form-label">
              <FileText size={16} />
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your note..."
              className="mobile-form-textarea"
              rows={15}
            />
          </div>

          {/* Desktop Actions */}
          <div className="mobile-form-actions">
            <button type="button" className="mobile-form-btn secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="mobile-form-btn primary">
              <Save size={16} />
              {note ? 'Update Note' : 'Create Note'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
