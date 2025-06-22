// src/components/TagPill.tsx
'use client';

import React from 'react';
import { Tag } from '@/context/NotesContext';
import { motion } from 'framer-motion';

interface TagPillProps {
  tag: Tag;
  isSelected?: boolean;
  onClick?: () => void;
}

const TagPill: React.FC<TagPillProps> = ({ tag, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`tag-pill ${isSelected ? 'selected' : ''}`}
    >
      <div
        className="tag-pill-color-dot"
        style={{ backgroundColor: tag.color }}
      />
      <span>{tag.name}</span>
    </div>
  );
};

export default TagPill;