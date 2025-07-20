'use client';

import { useNotes } from '@/context/NotesContext';
import { motion } from 'framer-motion';
import { NodeViewWrapper } from '@tiptap/react';

export const NoteNodeView = ({ node, editor }: { node: any, editor: any }) => {
  const { notes } = useNotes();
  const note = notes.find(n => n._id === node.attrs.noteId);

  if (!note) {
    return (
        <NodeViewWrapper className="note-node-view missing">
            <p>Note not found</p>
        </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className="note-node-view">
        <motion.div
            className="note-paper"
            drag
            dragElastic={0.2}
            whileDrag={{ scale: 1.05, boxShadow: '0px 10px 30px rgba(0,0,0,0.2)' }}
        >
            <h4>{note.title}</h4>
            <p>{note.content}</p>
        </motion.div>
    </NodeViewWrapper>
  );
}; 