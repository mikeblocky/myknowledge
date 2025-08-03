'use client';

import React, { useState } from 'react';
// Make sure `createTag` is available from your context.
import { useNotes } from '@/context/NotesContext'; 
import { Trash2, Pencil, X, Check, Tag as TagIcon, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import clsx from 'clsx';

const COLOR_PALETTE = [
  '#4285F4', '#DB4437', '#F4B400', '#0F9D58', '#7C3AED', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#6B7280'
];

// --- SUB-COMPONENTS ---

const ConfirmationDialog = ({ open, onConfirm, onCancel, title, message }: { open: boolean, onConfirm: () => void, onCancel: () => void, title: string, message: string }) => (
  <AnimatePresence>
    {open && (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onCancel}>
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 w-full max-w-sm m-4 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          onClick={e => e.stopPropagation()}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <p className="text-gray-600 dark:text-gray-300 mt-2 mb-6 text-sm">{message}</p>
          <div className="flex justify-center gap-3">
            <button onClick={onCancel} className="px-5 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-gray-400">Cancel</button>
            <button onClick={onConfirm} className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-red-500">Delete</button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const ColorPicker = ({ selectedColor, onSelectColor }: { selectedColor: string, onSelectColor: (color: string) => void }) => (
  <div className="flex items-center flex-wrap gap-2">
    {COLOR_PALETTE.map(color => (
      <button
        key={color} type="button"
        className={clsx(
          'w-7 h-7 rounded-full border-2 transition-all duration-150 flex items-center justify-center',
          selectedColor === color ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-transparent hover:border-gray-400 dark:hover:border-gray-500',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:ring-blue-500'
        )}
        style={{ backgroundColor: color }}
        onClick={() => onSelectColor(color)}
        aria-label={`Select color ${color}`}
      >
        {selectedColor === color && <Check size={16} className="text-white" />}
      </button>
    ))}
  </div>
);

const EmptyState = () => (
    <div className="text-center py-16 px-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <TagIcon className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500" strokeWidth={1.5} />
        <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">Your Tag List is Empty</h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Use the form above to create your first tag.</p>
    </div>
);


// --- MAIN COMPONENT ---

export default function TagManager({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { tags, notes, deleteTag, updateTag, addTag } = useNotes();
  
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(COLOR_PALETTE[0]);
  const [isCreating, setIsCreating] = useState(false);

  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');
  const [editedColor, setEditedColor] = useState(COLOR_PALETTE[0]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<{ id: string, name: string } | null>(null);

  const getTagUsageCount = (tagId: string) => notes.filter(note => note.tagIds.includes(tagId)).length;

  const handleCreateTag = async () => {
    const trimmedName = newTagName.trim();
    if (!trimmedName) return toast.error('Tag name cannot be empty.');
    if (tags.some(t => t.name.toLowerCase() === trimmedName.toLowerCase())) return toast.error('A tag with this name already exists.');
    
    setIsCreating(true);
    try {
      await addTag(trimmedName, newTagColor);
      toast.success(`Tag "${trimmedName}" created!`);
      setNewTagName('');
      setNewTagColor(COLOR_PALETTE[0]);
    } catch (e) {
      toast.error("Failed to create tag.");
    } finally {
      setIsCreating(false);
    }
  };

  const startEditing = (id: string, name: string, color: string) => { setEditingTagId(id); setEditedName(name); setEditedColor(color); };
  const cancelEditing = () => setEditingTagId(null);

  const saveEdit = async (id: string) => {
    const trimmedName = editedName.trim();
    if (!trimmedName) return toast.error('Tag name cannot be empty');
    if (tags.some(t => t._id !== id && t.name.toLowerCase() === trimmedName.toLowerCase())) return toast.error('A tag with this name already exists');
    
    setLoadingId(id);
    try {
      await updateTag(id, { name: trimmedName, color: editedColor });
      toast.success('Tag updated successfully');
      cancelEditing();
    } catch (e) {
      toast.error('Failed to update tag');
    } finally {
      setLoadingId(null);
    }
  };

  const handleDeleteClick = (tag: { _id: string, name: string }) => {
    if (getTagUsageCount(tag._id) > 0) return toast.error('Cannot delete a tag that is in use.');
    setTagToDelete({ id: tag._id, name: tag.name });
    setShowConfirmDelete(true);
  };
  
  const confirmDelete = async () => {
    if (!tagToDelete) return;
    setLoadingId(tagToDelete.id);
    setShowConfirmDelete(false);
    try {
      await deleteTag(tagToDelete.id);
      toast.success(`Tag "${tagToDelete.name}" deleted`);
    } catch (e) {
      toast.error('Failed to delete tag');
    } finally {
      setLoadingId(null);
      setTagToDelete(null);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div key="tag-manager-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} onClick={onClose}>
          <motion.div className="bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 flex flex-col h-full max-h-[90vh] sm:max-h-[80vh]" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ duration: 0.3, ease: 'easeOut' }} onClick={e => e.stopPropagation()}>
            <header className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Manage Tags</h2>
              <button className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full" onClick={onClose} aria-label="Close"><X size={24} /></button>
            </header>

            <main className="flex-grow p-5 space-y-6 overflow-y-auto">
              <section className='bg-white dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700'>
                <h3 className='text-md font-semibold mb-3 text-gray-800 dark:text-gray-200'>Create New Tag</h3>
                <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
                    <input type="text" value={newTagName} onChange={e => setNewTagName(e.target.value)} placeholder="New tag name..." className="w-full sm:flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    <ColorPicker selectedColor={newTagColor} onSelectColor={setNewTagColor} />
                    <button onClick={handleCreateTag} disabled={isCreating || !newTagName.trim()} className="w-full sm:w-auto flex justify-center items-center gap-2 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                        <Plus size={16} /> {isCreating ? 'Creating...' : 'Create'}
                    </button>
                </div>
              </section>

              <section>
                {tags.length > 0 ? (
                  <LayoutGroup>
                    <ul className="space-y-3">
                      <AnimatePresence>
                        {tags.map(tag => (
                          <motion.li layout="position" key={tag._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3, ease: 'easeOut' }} className={clsx("bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 transition-shadow hover:shadow-md", editingTagId === tag._id && "ring-2 ring-blue-500")}>
                            {editingTagId === tag._id ? (
                              <div className="flex flex-col gap-4">
                                <input type="text" value={editedName} onChange={e => setEditedName(e.target.value)} className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" autoFocus />
                                <ColorPicker selectedColor={editedColor} onSelectColor={setEditedColor} />
                                <div className="flex gap-3 justify-end mt-2">
                                  <button onClick={cancelEditing} className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100 font-semibold text-sm">Cancel</button>
                                  <button onClick={() => saveEdit(tag._id)} className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm disabled:opacity-50" disabled={loadingId === tag._id || !editedName.trim()}>
                                    {loadingId === tag._id ? 'Saving...' : 'Save'}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 min-w-0">
                                  <span className="w-4 h-4 rounded-full flex-shrink-0 border border-black/10 dark:border-white/10" style={{ backgroundColor: tag.color }}></span>
                                  <span className="font-medium text-gray-800 dark:text-gray-100 truncate" title={tag.name}>{tag.name}</span>
                                  <span className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded-full">{getTagUsageCount(tag._id)} use{getTagUsageCount(tag._id) !== 1 ? 's' : ''}</span>
                                </div>
                                <div className="flex gap-1 flex-shrink-0">
                                  <button onClick={() => startEditing(tag._id, tag.name, tag.color)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100/50 dark:hover:bg-gray-700 dark:hover:text-blue-400 rounded-full transition-colors" title="Edit tag" disabled={!!loadingId}><Pencil size={18} /></button>
                                  <button onClick={() => handleDeleteClick(tag)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100/50 dark:hover:bg-gray-700 dark:hover:text-red-400 rounded-full transition-colors" title="Delete tag" disabled={!!loadingId}><Trash2 size={18} /></button>
                                </div>
                              </div>
                            )}
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  </LayoutGroup>
                ) : ( <EmptyState /> )}
              </section>
            </main>
          </motion.div>
        </motion.div>
      )}
      <div key="confirmation-dialog-wrapper">
        <ConfirmationDialog open={showConfirmDelete} onCancel={() => setShowConfirmDelete(false)} onConfirm={confirmDelete} title="Delete Tag" message={`Are you sure you want to permanently delete the tag "${tagToDelete?.name}"? This action cannot be undone.`} />
      </div>
    </AnimatePresence>
  );
}