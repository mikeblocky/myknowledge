// src/components/TagSelector.tsx
'use client';
import { useState } from 'react';
import { useNotes, Tag } from '@/context/NotesContext';
import { SketchPicker } from 'react-color';

interface TagSelectorProps {
  selectedTagIds: number[];
  onTagChange: (newTagIds: number[]) => void;
}

export default function TagSelector({ selectedTagIds, onTagChange }: TagSelectorProps) {
  const { tags, addTag } = useNotes();
  const [newTagName, setNewTagName] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [newTagColor, setNewTagColor] = useState('#458588');

  const handleToggleTag = (tagId: number) => {
    const newSelection = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter(id => id !== tagId)
      : [...selectedTagIds, tagId];
    onTagChange(newSelection);
  };

  const handleCreateTag = () => {
    if (!newTagName.trim()) return;
    const newTag = addTag(newTagName, newTagColor);
    onTagChange([...selectedTagIds, newTag.id]);
    setNewTagName('');
    setShowColorPicker(false);
  };

  return (
    <div className="tag-selector">
      <div className="tag-pills-container">
        {tags.map(tag => (
          <button
            key={tag.id}
            type="button"
            className={`tag-pill-option ${selectedTagIds.includes(tag.id) ? 'selected' : ''}`}
            style={{ '--tag-color': tag.color } as React.CSSProperties}
            onClick={() => handleToggleTag(tag.id)}
          >
            {tag.name}
          </button>
        ))}
      </div>
      <div className="new-tag-form">
        <input
          type="text"
          placeholder="add or create tag..."
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleCreateTag())}
        />
        <button
          type="button"
          className="color-picker-toggle"
          style={{ backgroundColor: newTagColor }}
          onClick={() => setShowColorPicker(!showColorPicker)}
        />
        <button type="button" onClick={handleCreateTag}>add</button>
      </div>
      {showColorPicker && (
        <div className="color-picker-popover">
          <SketchPicker color={newTagColor} onChange={(color) => setNewTagColor(color.hex)} />
        </div>
      )}
    </div>
  );
}