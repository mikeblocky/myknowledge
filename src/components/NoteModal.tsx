<<<<<<< HEAD
// src/components/NoteModal.tsx
=======
>>>>>>> c1fb7f2977895023cc5098c75439c805d43925fa
'use client';

import { useState, useEffect } from 'react';
import { Note, useNotes } from '@/context/NotesContext';
import TagPill from './TagPill';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, X, Tag, Type, FileText } from 'lucide-react';

interface NoteModalProps {
  note: Note | null;
<<<<<<< HEAD
  onSave: (note: { title: string; content: string; tagIds: string[] }) => void;
=======
  onSave: (note: { title: string; content: string; tagIds: number[] }) => void;
>>>>>>> c1fb7f2977895023cc5098c75439c805d43925fa
  onClose: () => void;
}

export default function NoteModal({ note, onSave, onClose }: NoteModalProps) {
<<<<<<< HEAD
  const { tags, addTag } = useNotes();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#cccccc');
  
=======
  const { tags } = useNotes();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

>>>>>>> c1fb7f2977895023cc5098c75439c805d43925fa
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

<<<<<<< HEAD
  const handleTagToggle = (tagId: string) => {
=======
  const handleTagToggle = (tagId: number) => {
>>>>>>> c1fb7f2977895023cc5098c75439c805d43925fa
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
<<<<<<< HEAD
            <X size={22} />
=======
            <X size={24} />
>>>>>>> c1fb7f2977895023cc5098c75439c805d43925fa
          </button>
        </div>

        <form className="note-form" onSubmit={handleSubmit}>
          <div className="form-group">
<<<<<<< HEAD
            <label htmlFor="title"><Type size={12}/> Title</label>
=======
            <label htmlFor="title"><Type size={14}/> Title</label>
>>>>>>> c1fb7f2977895023cc5098c75439c805d43925fa
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Your note title"
              required
            />
          </div>
<<<<<<< HEAD

           {/* Tag selection and creation combined */}
        <div className="form-group">
            <label><Tag size={12}/> Tags</label>
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
          <div
            className="add-tag-form"
            style={{
              display: 'flex',
              gap: 8,
              marginBottom: 12,
              marginTop: 8,
              alignItems: 'center'
            }}
          >
            <input
              type="text"
              value={newTagName}
              onChange={e => setNewTagName(e.target.value)}
              placeholder="New tag name"
              style={{ flex: 1, minWidth: 0 }}
            />
            <input
              type="color"
              value={newTagColor}
              onChange={e => setNewTagColor(e.target.value)}
              title="Pick tag color"
              style={{ width: 32, height: 32, padding: 0, border: 'none', background: 'none' }}
            />
            <button
            type="button"
              onClick={async () => {
              if (!newTagName.trim()) return;
              const newTag = await addTag(newTagName, newTagColor);
              setNewTagName('');
              setNewTagColor('#cccccc');
              setSelectedTagIds(prev => [...prev, newTag._id]);
              }}
            >
              Add Tag
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="content"><FileText size={12}/> Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing..."
            rows={10}
          />
        </div>

        <div className="form-actions">
          <button type="button" className="form-button secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="form-button primary">
            <Save size={14} />
            Save Note
          </button>
        </div>
      </form>
      </motion.div>
    </motion.div>
  );
}
=======
          
          <div className="form-group">
            <label><Tag size={14}/> Tags</label>
            <div className="tags-list">
              {tags.map(tag => (
                <TagPill
                  key={tag.id}
                  tag={tag}
                  isSelected={selectedTagIds.includes(tag.id)}
                  onClick={() => handleTagToggle(tag.id)}
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
>>>>>>> c1fb7f2977895023cc5098c75439c805d43925fa
