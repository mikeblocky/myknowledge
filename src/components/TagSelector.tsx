// src/components/TagSelector.tsx
'use client';
import { useState } from 'react';
import { useNotes } from '@/context/NotesContext';
import TagPill from './TagPill'; // Import the TagPill component

const PRESET_TAGS = [
  { name: 'Work', color: '#4285F4' },
  { name: 'Personal', color: '#F4B400' },
  { name: 'Urgent', color: '#DB4437' },
  { name: 'Idea', color: '#34A853' },
];

const COLOR_PALETTE = [
  '#4285F4', '#F4B400', '#DB4437', '#34A853', '#A142F4', '#F44292', '#00B8D9', '#FFAB00', '#FF5630', '#36B37E', '#6554C0', '#FF8B00'
];

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
  const [newTagColor, setNewTagColor] = useState(COLOR_PALETTE[0]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Autocomplete suggestions
  const filteredSuggestions = tags.filter(
    tag => newTagName && tag.name.toLowerCase().includes(newTagName.toLowerCase())
  );

  const handleToggleTag = (tagId: string) => {
    const newSelection = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter(id => id !== tagId)
      : [...selectedTagIds, tagId];
    onTagChange(newSelection);
  };

  const handleCreateTag = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmedName = newTagName.trim();
    if (!trimmedName) return;
    // Check if tag already exists
    const existing = tags.find(t => t.name.toLowerCase() === trimmedName.toLowerCase());
    if (existing) {
      onTagChange([...selectedTagIds, existing._id]);
      setNewTagName('');
      setShowSuggestions(false);
      return;
    }
    // Create new tag with chosen color
    const newTag = await addTag(trimmedName, newTagColor);
    onTagChange([...selectedTagIds, newTag._id]);
    setNewTagName('');
    setShowSuggestions(false);
  };

  const handlePresetClick = async (preset: { name: string; color: string }) => {
    // If tag exists, select it; else create it
    const existing = tags.find(t => t.name.toLowerCase() === preset.name.toLowerCase());
    if (existing) {
      onTagChange([...selectedTagIds, existing._id]);
    } else {
      const newTag = await addTag(preset.name, preset.color);
      onTagChange([...selectedTagIds, newTag._id]);
    }
  };

  return (
    <div className="tag-selector-container">
      {/* Preset tags */}
      <div className="preset-tags-row">
        {PRESET_TAGS.map(preset => (
          <TagPill
            key={preset.name}
            tag={{ _id: preset.name, name: preset.name, color: preset.color }}
            isSelected={!!tags.find(t => t.name.toLowerCase() === preset.name.toLowerCase() && selectedTagIds.includes(t._id))}
            onClick={() => handlePresetClick(preset)}
          />
        ))}
      </div>
      {/* Existing tags */}
      <div className="tags-list-row">
        {tags.map(tag => (
          <TagPill
            key={tag._id}
            tag={tag}
            isSelected={selectedTagIds.includes(tag._id)}
            onClick={() => handleToggleTag(tag._id)}
          />
        ))}
      </div>
      {/* New tag input with autocomplete and color picker */}
      <form onSubmit={handleCreateTag} className="add-tag-form">
        <div className="add-tag-input-row">
          <input
            type="text"
            value={newTagName}
            onChange={e => {
              setNewTagName(e.target.value);
              setShowSuggestions(true);
            }}
            placeholder="+ Add Tag"
            className="add-tag-input"
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          />
          <div className="color-picker-row">
            {COLOR_PALETTE.map(color => (
              <span
                key={color}
                className={`color-dot${newTagColor === color ? ' selected' : ''}`}
                style={{ backgroundColor: color, border: newTagColor === color ? '2px solid #333' : '1px solid #ccc' }}
                onClick={() => setNewTagColor(color)}
              />
            ))}
          </div>
        </div>
        {/* Autocomplete suggestions */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="tag-suggestions-dropdown">
            {filteredSuggestions.map(tag => (
              <div
                key={tag._id}
                className="tag-suggestion-item"
                onMouseDown={() => {
                  onTagChange([...selectedTagIds, tag._id]);
                  setNewTagName('');
                  setShowSuggestions(false);
                }}
              >
                <TagPill tag={tag} />
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
}