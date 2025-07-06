'use client';

import { JournalEntry } from '@/context/NotesContext';
import { motion } from 'framer-motion';

interface JournalListItemProps {
  entry: JournalEntry;
  isSelected: boolean;
  onClick: () => void;
  [key: string]: any; // Accept framer-motion props
}

const JournalListItem = ({ entry, isSelected, onClick, ...rest }: JournalListItemProps) => {
  // Strip HTML for a plain text preview
  const plainContent = entry.content.replace(/<[^>]+>/g, '');

  return (
    <motion.li
      className={`note-list-item ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      whileHover={{ scale: 1.02, x: 5 }}
      whileTap={{ scale: 0.98 }}
      layout
      {...rest}
    >
      <h3>{entry.title || 'Untitled Entry'}</h3>
      <p className="note-list-item-date">
        {new Date(entry.date).toLocaleDateString('en-us', { month: 'long', day: 'numeric' })}
      </p>
      <p>{plainContent ? plainContent.substring(0, 100) : 'No content'}</p>
    </motion.li>
  );
};

export default JournalListItem; 