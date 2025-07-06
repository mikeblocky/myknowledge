// src/components/TagManager.tsx
'use client';

import React, { useState } from 'react';
import { useNotes } from '@/context/NotesContext';
import { Trash2, Pencil } from 'lucide-react';

export default function TagManager() {
  const { tags, deleteTag, updateTag } = useNotes();
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');
  const [editedColor, setEditedColor] = useState('#000000');

  const startEditing = (id: string, name: string, color: string) => {
    setEditingTagId(id);
    setEditedName(name);
    setEditedColor(color);
  };

  const cancelEditing = () => {
    setEditingTagId(null);
    setEditedName('');
    setEditedColor('#000000');
  };

  const saveEdit = async (id: string) => {
    // Call context updateTag → server PUT + update state
    await updateTag(id, { name: editedName, color: editedColor });
    cancelEditing();
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm('Are you sure you want to delete this tag?');
    if (confirmDelete) {
      await deleteTag(id);
    }
  };

  return (
    <div className="tag-manager-container p-4">
      <h2 className="text-xl font-semibold mb-4">Tag Management</h2>
      <ul className="space-y-2">
        {tags.map(tag => (
          <li
            key={tag._id}
            className="flex items-center justify-between bg-gray-100 rounded px-3 py-2"
          >
            {editingTagId === tag._id ? (
                // ─── Form edit ───────────────────────────────────────
              <div className="flex items-center space-x-2 w-full">
                <input
                  type="text"
                  value={editedName}
                  onChange={e => setEditedName(e.target.value)}
                  className="border px-2 py-1 rounded w-1/2"
                />
                <input
                  type="color"
                  value={editedColor}
                  onChange={e => setEditedColor(e.target.value)}
                />
                <button onClick={() => saveEdit(tag._id)} className="text-green-600">
                  Save
                </button>
                <button onClick={cancelEditing} className="text-gray-500">
                  Close
                </button>
              </div>
            ) : (
              // ─── Tag Display ────────────────────────────────────
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  ></div>
                  <span>{tag.name}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => startEditing(tag._id, tag.name, tag.color)}
                    className="text-blue-600"
                    title="Re-edit tag"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(tag._id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete tag"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
