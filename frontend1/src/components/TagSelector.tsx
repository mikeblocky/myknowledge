// src/components/TagSelector.tsx
'use client';
import { useState } from 'react';
import { useNotes } from '@/context/NotesContext';
import TagPill from './TagPill'; // Import the TagPill component

// A simple hash function to get a color from a string
const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
}

interface TagSelectorProps {
  selectedTagIds: string[];
  onTagChange: (newTagIds: string[]) => void;
}

export default function TagSelector({ selectedTagIds, onTagChange }: TagSelectorProps) {
  const { tags, addTag } = useNotes();
  const [newTagName, setNewTagName] = useState('');
  
  const handleToggleTag = (tagId: string) => {
    const newSelection = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter(id => id !== tagId)
      : [...selectedTagIds, tagId];
    onTagChange(newSelection);
  };

  const handleCreateTag = () => {
    const trimmedName = newTagName.trim();
    if (!trimmedName) return;
    
    // Use our hash function to generate a color
    const newTagColor = stringToColor(trimmedName);
    const newTag = addTag(trimmedName, newTagColor);

    onTagChange([...selectedTagIds, newTag._id]);
    setNewTagName('');
  };

  return (
    <div className="tag-selector-container">
      {tags.map(tag => (
        <TagPill
          key={tag._id}
          tag={tag}
          isSelected
          onClick={() => handleToggleTag(tag._id)}
        />
      ))}
      <form onSubmit={handleCreateTag}>
        <input
          type="text"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          placeholder="+ Add Tag"
          className="add-tag-input"
        />
      </form>
    </div>
  );
}