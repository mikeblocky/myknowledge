'use client';

import { Note, useNotes } from '@/context/NotesContext';
import { format } from 'date-fns';
import { Pin, Trash2, FilePenLine } from 'lucide-react';
import TagPill from './TagPill';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

interface NoteDisplayProps {
  note: Note;
  onEdit: () => void;
}

export default function NoteDisplay({ note, onEdit }: NoteDisplayProps) {
  const { tags, togglePinNote, deleteNote } = useNotes();
  const noteTags = tags.filter(tag => note.tagIds.includes(tag.id));

  return (
    <motion.div 
      className="note-display-container"
      key={note.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="note-display-header">
        <h1>{note.title}</h1>
        <div className="note-display-actions">
          <button 
            onClick={() => togglePinNote(note.id)} 
            className={`icon-button ${note.isPinned ? 'pinned' : ''}`}
            title={note.isPinned ? "Unpin note" : "Pin note"}
          >
            <Pin size={18} />
          </button>
          <button onClick={onEdit} className="icon-button" title="Edit note">
            <FilePenLine size={18} />
          </button>
          <button 
            onClick={() => deleteNote(note.id)} 
            className="icon-button destructive"
            title="Delete note"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      <div className="note-display-meta">
        <span>{format(new Date(note.date), 'MMMM d, yyyy')}</span>
        {noteTags.length > 0 && (
          <div className="note-display-tags">
            {noteTags.map(tag => <TagPill key={tag.id} tag={tag} />)}
          </div>
        )}
      </div>
      <div className="note-display-content">
        <ReactMarkdown>{note.content}</ReactMarkdown>
      </div>
    </motion.div>
  );
} 